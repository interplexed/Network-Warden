import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function LogDateControl({ date, setDate, setPage, highlightWithRanges }) {

  return (
    <div className="toolbar-section">
      <h5>Select Date</h5>
      <div className="flex-wrap-gap">
        <DatePicker
        selected={date}
        onChange={(newDate) => {
          setDate(newDate);
          setPage(1);
        }}
        highlightDates={highlightWithRanges}
        dateFormat="yyyy-MM-dd"
        className="form-control"
        popperPlacement="bottom-start"
      />
      </div>
    </div>
  );
};