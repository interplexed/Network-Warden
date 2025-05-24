
-----------------------------------------------------------------------------------------------------
-- CREATE HYPERTABLE

SELECT create_hypertable('suricata_logs', 'timestamp', chunk_time_interval => INTERVAL '1 day');



-----------------------------------------------------------------------------------------------------
-- SURICATA POLICIES: INDEXING RETENTION COMPRESSION

-- Indexes for fast queries
CREATE INDEX ON suricata_logs (timestamp DESC);
CREATE INDEX ON suricata_logs (event_type);
CREATE INDEX ON suricata_logs (src_ip);
CREATE INDEX ON suricata_logs (dest_ip);
CREATE INDEX ON suricata_logs (alert_signature);
-- Retention: Delete logs older than 30 days
SELECT add_retention_policy('suricata_logs', INTERVAL '30 days');
-- Compression: Compress logs older than 7 days
ALTER TABLE suricata_logs SET (timescaledb.compress, timescaledb.compress_segmentby = 'src_ip');
SELECT add_compression_policy('suricata_logs', INTERVAL '7 days');
