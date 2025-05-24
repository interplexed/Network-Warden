/*
  Suricata Eve Log Processor

  This script continuously monitors the Suricata Eve log and inserts new logs into the DB.

  It has the following features:
    Watches a hardcoded Suricata log file path via fs.watchFile
    Tracks last read file offset in the PostgreSQL `log_metadata` table
    Efficiently reads only new log lines using fs.createReadStream with `start` offset
    Batches insertions for performance (default batch size: 100 logs)
    Debounces file changes to avoid duplicate processing on rapid log appends
    Handles partial lines and malformed JSON gracefully, and skips entries without a timestamp
*/

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.LOGSUSER_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.LOGSUSER_PW,
  port: 5432,
});

const EVE_FILE_PATH = '/mnt/suricata_logs/eve.json'; // Smb mounted log location
const BATCH_SIZE = 100;
let logsBatch = [];
let processing = false; // Prevents parallel execution
let timeoutId = null; // Debounce timer


// Get last processed offset from the database
const getLastOffset = async () => {
  const res = await pool.query(
    "SELECT last_offset FROM log_metadata WHERE log_type = 'suricata'"
  );
  return res.rows.length ? res.rows[0].last_offset : 0;
};


// Update last processed offset in the database
const updateLastOffset = async (offset) => {
  await pool.query(
    `INSERT INTO log_metadata (log_type, last_offset) 
     VALUES ('suricata', $1)
     ON CONFLICT (log_type) 
     DO UPDATE SET last_offset = EXCLUDED.last_offset;`,
    [offset]
  );
};


// Insert logs in batches
const insertBatch = async (logs) => {
  if (logs.length === 0) return;

  // Create the VALUES part of the query with correct placeholders
  const valuePlaceholders = logs
    .map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`)
    .join(', ');

  // Flatten the logs into a single array of values
  const values = logs.flatMap(log => [
    log.timestamp,
    log.event_type,
    log.src_ip,
    log.dest_ip,
    log.alert_signature,
  ]);

  const query = `
    INSERT INTO suricata_logs (timestamp, event_type, src_ip, dest_ip, alert_signature)
    VALUES ${valuePlaceholders}
  `;

  try {
    await pool.query(query, values);
    console.log(`Inserted ${logs.length} Suricata logs`);
  } catch (err) {
    console.error('Error inserting batch:', err);
  }
};


// Process new logs from eve.json
const processEveJson = async () => {
  if (processing) return;
  processing = true;

  try {
    const lastProcessedOffset = Number(await getLastOffset()); // Offset is stored in db
    const fileStats = fs.statSync(EVE_FILE_PATH);
    
    if (fileStats.size <= lastProcessedOffset) {
      processing = false;
      return;
    }

    const stream = fs.createReadStream(EVE_FILE_PATH, {
      encoding: 'utf8',
      start: lastProcessedOffset, // Read only new data
    });

    let buffer = '';
    let newOffset = lastProcessedOffset;

    for await (const chunk of stream) {
      buffer += chunk;
      newOffset += Buffer.byteLength(chunk);
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep the last partial line

      const logs = [];
      for (const line of lines) {
        try {
          const log = JSON.parse(line);
          if (log && log.timestamp) {
            logs.push({
              timestamp: log.timestamp, //.toISOString()
              event_type: log.event_type || 'unknown',
              src_ip: log.src_ip || 'unknown',
              dest_ip: log.dest_ip || 'unknown',
              alert_signature: log.alert ? log.alert.signature : 'N/A',
            });
          }
        } catch (err) {
          console.warn('Skipping malformed JSON line:', line);
        }
      }

      logsBatch.push(...logs);
      if (logsBatch.length >= BATCH_SIZE) {
        await insertBatch(logsBatch.splice(0, BATCH_SIZE));
      }
    }

    // Insert remaining logs
    if (logsBatch.length > 0) {
      await insertBatch(logsBatch);
      logsBatch = [];
    }

    await updateLastOffset(newOffset); // Save new offset
  } catch (err) {
    console.error('Error processing eve.json:', err);
  } finally {
    processing = false;
  }
};


// Watch for file changes (debounced)
const watchEveJson = () => {
  fs.watchFile(EVE_FILE_PATH, { interval: 5000 }, () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(processEveJson, 2000);
  });
};

// Script trigger
console.log("WATCHING SURICATA");
watchEveJson();
