import React, { useState, useEffect } from "react";
import '../css/styles.css';


function DisplaySuricata({
  selectedEventTypes,
  date,
  page,
  rowsPerPage,
  totalPages,
  setTotalPages,
  showSrcIP,
  showDestIP,
  selectedLog,
  setSelectedLog
}) {

  const [logs, setLogs] = useState([]);
  
  // Trigger the log retrival
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [selectedEventTypes, date, page, rowsPerPage]);


  // Scan the database for logs
  const fetchLogs = async () => {
    try {
      const eventTypesQuery = selectedEventTypes.join(",");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/suricata/logs?date=${date.toISOString().split("T")[0]}&page=${page}&limit=${rowsPerPage}&eventTypes=${encodeURIComponent(eventTypesQuery)}`
      );
      const data = await res.json();
      setLogs(data.logs);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };


  // Close the details modal
  const closeDetails = () => setSelectedLog(null);



  return (
      <div>
        <h2>Suricata Eve Logs</h2>
        
        {/* Eve Logs Table */}
        {/*<div style={{ overflowX: "auto", maxWidth: "100%" }}>*/}
        <table border="1" style={{ minWidth: "700px", cursor: "pointer" }}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Type</th>
              {showSrcIP && <th>Source IP</th>}
              {showDestIP && <th>Destination IP</th>}
              <th>Alert Signature</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
            <tr key={index} onClick={() => setSelectedLog(log)}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.event_type}</td>
              {showSrcIP && <td>{log.src_ip}</td>}
              {showDestIP && <td>{log.dest_ip}</td>}
              <td>{log.alert_signature || "N/A"}</td>
            </tr>
            ))}
          </tbody>
        </table>
        {/*</div>*/}

        {/* Details Modal */}
        {selectedLog && (
          <div
            className="modal-overlay"
            onClick={closeDetails}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "8px",
                maxWidth: "400px",
                width: "90%",
                position: "relative",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
            >
              <button
                onClick={closeDetails}
                style={{
                  position: "absolute",
                  top: "0.25rem",
                  right: "0.5rem",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
              <h2>Log Details</h2>
              <p><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}</p>
              <p><strong>Type:</strong> {selectedLog.event_type}</p>
              <p><strong>Source IP:</strong> {selectedLog.src_ip}</p>
              <p><strong>Destination IP:</strong> {selectedLog.dest_ip}</p>
              <p><strong>Alert Signature:</strong> {selectedLog.alert_signature || "N/A"}</p>
            </div>
          </div>
        )}
      </div>
  );
}

export default DisplaySuricata;