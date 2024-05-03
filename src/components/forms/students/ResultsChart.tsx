import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { ExamWiseTotals } from "./ProgressData"; // Update the import

interface BarChartProps {
  examData: ExamWiseTotals;
}

const BarChart: React.FC<BarChartProps> = ({ examData }) => {
  const chartContainer = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartContainer.current || !examData) return;

    const ctx = chartContainer.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = Object.keys(examData).reverse();
    const dataValues = Object.values(examData).reverse();

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Marks",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            data: dataValues,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [examData]);

  return <canvas ref={chartContainer} />;
};

export default BarChart;
