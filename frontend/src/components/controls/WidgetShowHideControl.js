import React from "react";

export default function WidgetShowHideControl({ showChart, toggleChart }) {
  return (
    <div className="toolbar-section">
      <h5>Traffic Flow Chart</h5>
      <div className="flex-wrap-gap">
        <button className={`btn-toolbar ${showChart ? "active" : ""}`} onClick={toggleChart}>
        Top 10
      </button>
      </div>
    </div>
  );
};