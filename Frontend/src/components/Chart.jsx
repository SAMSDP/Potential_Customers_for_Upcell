

import React, { useRef } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);


const Chart = ({ data, options, height = 220, type = "line" }) => {
  const chartRef = useRef();

  // Create a vertical gradient for the area fill
  const getGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.25)'); // top, more visible
    gradient.addColorStop(1, 'rgba(157, 11, 11, 0.05)'); // bottom, subtle
    return gradient;
  };

  // Chart.js options with a beautiful shaded area
  const mergedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      ...((options && options.plugins) || {}),
    },
    elements: {
      line: {
        borderColor: '#ef4444',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
      },
      point: {
        radius: 5,
        backgroundColor: '#fff',
        borderColor: '#ef4444',
        borderWidth: 2,
        hoverRadius: 7,
        hoverBackgroundColor: '#ef4444',
        hoverBorderColor: '#fff',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30,
        ticks: {
          callback: value => value + '%',
        },
        ...((options && options.scales && options.scales.y) || {}),
      },
      x: {
        ...((options && options.scales && options.scales.x) || {}),
      },
    },
    ...options,
  };

  // Dynamically set the backgroundColor as a gradient
  const chartData = React.useMemo(() => {
    if (!chartRef.current) return data;
    const chart = chartRef.current;
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    if (!ctx || !chartArea) return data;
    return {
      ...data,
      datasets: data.datasets.map(ds => ({
        ...ds,
        fill: true,
        borderColor: '#ef4444',
        backgroundColor: getGradient(ctx, chartArea),
        pointBackgroundColor: '#fff',
        pointBorderColor: '#ef4444',
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#ef4444',
        pointHoverBorderColor: '#fff',
        tension: 0.35,
      })),
    };
  }, [data]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {type === "bar" ? (
        <Bar
          ref={chartRef}
          data={chartData}
          options={mergedOptions}
          style={{ height: '100%', width: '100%' }}
        />
      ) : type === "doughnut" ? (
        <Doughnut
          data={data}
          options={options}
          style={{ height: '100%', width: '100%' }}
        />
      ) : (
        <Line
          ref={chartRef}
          data={chartData}
          options={mergedOptions}
          style={{ height: '100%', width: '100%' }}
        />
      )}
    </div>
  );
};

export default Chart;
