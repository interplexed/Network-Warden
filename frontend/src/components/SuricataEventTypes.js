import React, { useState, useEffect } from "react";


function SuricataEventTypes() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/suricata/event-types`
      );
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : data.logs || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };



  return (
    <>
      <h2>Suricata Event Types</h2>      
      <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ background: "#f4f4f4", borderBottom: "2px solid black" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Event Type</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <tr key={index} style={{ borderBottom: "1px solid black" }}>
                <td style={{ padding: "8px" }}>{log.event_type || "Unknown"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="1" style={{ padding: "8px", textAlign: "center" }}>No event types found</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default SuricataEventTypes;
