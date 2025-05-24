#!/bin/bash

# This script initiates timescaledb, tables, and a role with related privileges into postgresql
# This is by design as otherwise a plaintext password would exist in the sql file
# Whereas bash can use environement variables
# See also the init.sql.  Why not just put it all here?


set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS timescaledb;
  CREATE TABLE IF NOT EXISTS log_metadata (
      log_type TEXT PRIMARY KEY,
      last_offset BIGINT NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS suricata_logs (
      id SERIAL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT now(), 
      event_type TEXT,
      src_ip TEXT,
      dest_ip TEXT,
      alert_signature TEXT,
      PRIMARY KEY (timestamp, id)
  );
  CREATE USER "$LOGSUSER_USER" WITH PASSWORD '$LOGSUSER_PW';
  GRANT CONNECT ON DATABASE $POSTGRES_DB TO $LOGSUSER_USER;
  GRANT USAGE ON SCHEMA public TO $LOGSUSER_USER;
  GRANT SELECT, INSERT ON suricata_logs TO $LOGSUSER_USER;
  GRANT SELECT, INSERT, UPDATE ON log_metadata TO $LOGSUSER_USER;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO $LOGSUSER_USER;
EOSQL