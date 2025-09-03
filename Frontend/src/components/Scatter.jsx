import React from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const COLORS = {
  loyal: "rgba(52, 199, 89, 0.7)",
  atrisk: "rgba(255, 59, 48, 0.7)",
  neutral: "rgba(255, 159, 10, 0.7)",
};

export default function ScatterChart({ data }) {
  const chartData = {
    datasets: [
      {
        label: "Loyal Customers",
        data: data.loyal,
        backgroundColor: COLORS.loyal,
      },
      {
        label: "At Risk Customers",
        data: data.atrisk,
        backgroundColor: COLORS.atrisk,
      },
      {
        label: "Neutral Customers",
        data: data.neutral,
        backgroundColor: COLORS.neutral,
      },
    ],
  };

  const options = {
    responsive: true,          // enable responsiveness
    maintainAspectRatio: false, // allows height/width to adjust freely
    scales: {
      x: {
        title: { display: true, text: "Usage Score" },
        min: 0,
        max: 100,
      },
      y: {
        title: { display: true, text: "Satisfaction Score" },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const p = ctx.raw;
            return `ID:${p.id}, Usage:${p.x}, Satisfaction:${p.y}`;
          },
        },
      },
    },
  };

  return <Scatter data={chartData} options={options} />;
}
