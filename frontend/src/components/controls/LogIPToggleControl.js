import React from "react";

export default function IPToggleButtons({ showSrcIP, showDestIP, setShowSrcIP, setShowDestIP }) {
  {/*const buttonStyle = (active, activeColor) => ({
    padding: "8px 12px",
    border: "1px solid #333",
    borderRadius: "4px",
    backgroundColor: active ? activeColor : "#fff",
    color: active ? "#fff" : "#333",
    cursor: "pointer",
    userSelect: "none",
    boxShadow: active ? "inset 0 2px 5px rgba(0,0,0,0.3)" : "none",
    transition: "background-color 0.3s, color 0.3s",
    marginRight: "8px"
  });*/}

  return (
    <div className="toolbar-section">
      <h5>IP Visibility</h5>
      <div className="flex-wrap-gap">
        <button
          onClick={() => setShowSrcIP((prev) => !prev)}
          className={`btn-toolbar ${showSrcIP ? "active" : ""}`}
        >
          Show Source IP
        </button>
        <button
          onClick={() => setShowDestIP((prev) => !prev)}
          className={`btn-toolbar ${showDestIP ? "active" : ""}`}
        >
          Show Destination IP
        </button>
      </div>
    </div>
  );
}