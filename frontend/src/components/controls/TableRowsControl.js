import React from "react";

export default function TableRowsControl({ rowsPerPage, setRowsPerPage }) {
  return (
    <div className="toolbar-section">
      <h5>Table Rows Per Page</h5>
      <div className="flex-wrap-gap">
          <select value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
      </div>
    </div>
  );
};