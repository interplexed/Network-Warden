import React, { useState, useEffect } from "react";

function SuricataEventTypesToolbar({ selectedEventTypes, setSelectedEventTypes }) {
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/suricata/event-types`);
      const data = await res.json();
      const types = Array.isArray(data) ? data : data.logs || [];
      setEventTypes(types);
    } catch (err) {
      console.error("Error fetching event types:", err);
    }
  };

  const toggleEventType = (eventType) => {
    if (selectedEventTypes.includes(eventType)) {
      setSelectedEventTypes(selectedEventTypes.filter(type => type !== eventType));
    } else {
      setSelectedEventTypes([...selectedEventTypes, eventType]);
    }
  };

  return (
    <div className="toolbar-section">
      <h5>Available Event Types</h5>
      <div className="flex-wrap-gap">
        {eventTypes.length === 0 && <span>No event types</span>}
        {eventTypes.map((event, i) => {
          const eventType = event.event_type || event;
          const isActive = selectedEventTypes.includes(eventType);
          return (
            <button
              key={i}
              onClick={() => toggleEventType(eventType)}
              className={`btn-toolbar ${isActive ? "active" : ""}`}
              aria-pressed={isActive}
              type="button"
            >
              {eventType}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SuricataEventTypesToolbar;