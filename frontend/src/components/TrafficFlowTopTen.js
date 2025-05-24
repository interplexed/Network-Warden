import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";


function TrafficFlowTopTen() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/suricata/top-traffic`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching traffic data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data.length) return;

    console.log("Rendering TrafficChart with data:", data);

    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => item.dest_ip),
        datasets: [
          {
            data: data.map((item) => item.count),
            backgroundColor: "rgba(0, 0, 255, 0.6)",
            borderColor: "blue",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
	plugins: {
	  title: {
	    display: true,
	    text: 'Top 10 Traffic Flow Destinations',
	    font: {
	      size: 18
	    }
	  },
	  legend: {
	    display: false
	  }
	},
        scales: {
          x: {
            type: "category",
            title: {
              display: true,
              text: "Destination IP",
            },
          },  
          y: { beginAtZero: true,
            title: {
              display: true,
              text: "Logs Count",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <canvas ref={chartRef} id="trafficChart"></canvas>;
    </div>
  )
};

export default TrafficFlowTopTen;
