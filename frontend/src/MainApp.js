import React, { useState, useEffect, useMemo } from "react";
import { useToolbar } from "./components/ToolbarContext";

import LogDateControl from "./components/controls/LogDateControl";
import LogIPToggleControl from "./components/controls/LogIPToggleControl";
import LogEventTypeControl from "./components/controls/LogEventTypeControl";
import TablePaginationControl from "./components/controls/TablePaginationControl";
import TableRowsControl from "./components/controls/TableRowsControl";
import WidgetShowHideControl from "./components/controls/WidgetShowHideControl";

import DisplaySuricata from "./components/DisplaySuricata";
import TrafficFlowTopTen from "./components/TrafficFlowTopTen";
import SuricataEventTypes from "./components/SuricataEventTypes";
import ErrorBoundary from './components/ErrorBoundary';
import "./css/styles.css";

function MainApp() {
  const { controls, registerControls, clearControls } = useToolbar();

  const [availableDates, setAvailableDates] = useState(new Set());
  const [selectedEventTypes, setSelectedEventTypes] = useState(["flow"]);
  const [date, setDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showSrcIP, setShowSrcIP] = useState(true);
  const [showDestIP, setShowDestIP] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const [showChart, setShowChart] = useState(true);
  const [chartKey, setChartKey] = useState(0);
  const toggleChart = () => {
    if (!showChart) {setChartKey(prev => prev + 1);}
    setShowChart(prev => !prev);
  };

  
  // Use the api to get the dates which have available data
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/suricata/logs/dates`);
        const data = await res.json();
        setAvailableDates(new Set(data.availableDates.map(d => new Date(d).toDateString())));
      } catch (err) {
        console.error("Error fetching available dates:", err);
      }
    };
    fetchAvailableDates();
  }, []);

  // Highlight available dates in the LogDateControl
  // useMemo retained but maybe unnecessary
  const highlightWithRanges = useMemo(() => [
    {
      "react-datepicker__day--highlighted": [...availableDates].map(d => new Date(d)),
    },
  ], [availableDates]);



  useEffect(() => {
    registerControls(
      <>
        <h4>Suricata Controls</h4>
        <LogDateControl date={date} setDate={setDate} setPage={setPage} highlightWithRanges={highlightWithRanges} />
        <LogIPToggleControl showSrcIP={showSrcIP} setShowSrcIP={setShowSrcIP} showDestIP={showDestIP} setShowDestIP={setShowDestIP} />
        <LogEventTypeControl selectedEventTypes={selectedEventTypes} setSelectedEventTypes={setSelectedEventTypes} />
        <TablePaginationControl page={page} totalPages={totalPages} setPage={setPage} />
        <TableRowsControl rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
        <WidgetShowHideControl showChart={showChart} toggleChart={toggleChart} />
      </>
    );
    return () => clearControls();
  }, [
    date, highlightWithRanges,
    showSrcIP, showDestIP,
    selectedEventTypes,
    page, totalPages, rowsPerPage,
    showChart
  ]);

  return (
    <div className="dashboard">

      <aside className="sidebar">
       <ErrorBoundary>{controls}</ErrorBoundary>
      </aside>

      <main className="main-content">
        <h1>Suricata Dashboard</h1>
        <div className="widgets">
          <div className="widget">
            <ErrorBoundary>
              <DisplaySuricata
                availableDates={availableDates}
                setAvailableDates={setAvailableDates}
                date={date}
                setDate={setDate}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                setTotalPages={setTotalPages}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                selectedEventTypes={selectedEventTypes}
                setSelectedEventTypes={setSelectedEventTypes}
                showSrcIP={showSrcIP}
                setShowSrcIP={setShowSrcIP}
                showDestIP={showDestIP}
                setShowDestIP={setShowDestIP}
                selectedLog={selectedLog}
                setSelectedLog={setSelectedLog}
              />
            </ErrorBoundary>
          </div>
          <div className="widget"><ErrorBoundary><SuricataEventTypes /></ErrorBoundary></div>
          {showChart && (<div className="widget" key={chartKey}><ErrorBoundary><TrafficFlowTopTen /></ErrorBoundary></div>)}
        </div>
      </main>

    </div>
  );
}
export default MainApp;