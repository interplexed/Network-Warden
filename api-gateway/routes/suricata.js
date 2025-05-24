const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.LOGSUSER_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.LOGSUSER_PW,
  port: 5432,
});


//-------------------------------------------
// MAIN ROUTE TO RETURN ALL SURICATA EVE LOG DATA
router.get("/logs", async (req, res) => {
  try {
    let { date, page, limit, eventTypes} = req.query;

    page = parseInt(page, 10) || 1; // Default page 1
    limit = parseInt(limit, 10) || 10; // Default 10 results per page

    const offset = (page - 1) * limit;

    // Default date is today (UTC) at 00:00:00 or its the request date
    const selectedDate = date
      ? new Date(date + "T00:00:00.000Z")
      : new Date(new Date().setUTCHours(0, 0, 0, 0));

    // Next day is 00:00:00 for sql range filter
    const nextDay = new Date(selectedDate);
    nextDay.setUTCDate(selectedDate.getUTCDate() + 1);

    // Move request eventtypes into array
    const eventTypesArray = eventTypes ? eventTypes.split(",") : [];

    
    // Query for the selected date, by filters, with pagination
    const result = await pool.query(
      `SELECT * FROM suricata_logs 
      WHERE timestamp >= $1 
        AND timestamp < $2
        AND ($3::text[] IS NULL OR event_type = ANY($3))
      ORDER BY timestamp ASC 
      LIMIT $4 OFFSET $5`,
	  [selectedDate, nextDay, eventTypesArray.length > 0 ? eventTypesArray : null, limit, offset]
    );


    // Get total count for pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM suricata_logs 
      WHERE timestamp >= $1 AND timestamp < $2
        AND ($3::text[] IS NULL OR event_type = ANY($3))`,
      //[selectedDate, nextDay]
      [selectedDate, nextDay, eventTypesArray.length > 0 ? eventTypesArray : null]
    );

    const totalLogs = parseInt(countResult.rows[0].count, 10);

    res.json({
      logs: result.rows,
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page,
      selectedDate: selectedDate.toISOString().split("T")[0], // Return selected date
      limit,
    });
  } catch (err) {
    console.error("Error fetching logs", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//-------------------------------------------
// GET ALL DATES - USED IN HIGHLIGHTING DATEPICKER
router.get("/logs/dates", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT DATE(timestamp) AS log_date 
      FROM suricata_logs 
      ORDER BY log_date DESC
    `);

    const availableDates = result.rows.map(row => row.log_date);

    res.json({ availableDates });
  } catch (err) {
    console.error("Error fetching log dates", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//-------------------------------------------
// TOP DEST_IP TRAFFIC COUNTS
router.get("/top-traffic", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT dest_ip, COUNT(*) as count
      FROM suricata_logs
      GROUP BY dest_ip
      ORDER BY count DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching top traffic data:", error);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});


//-------------------------------------------
// GET ALL EVENT TYPES
router.get("/event-types", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT event_type
      FROM suricata_logs
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching all event types:", error);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});


module.exports = router;