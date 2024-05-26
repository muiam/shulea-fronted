import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface MonthData {
  month_name: string;
  total_revenue: number;
  total_expenditure: number;
}

interface LineChartProps {
  monthsData: MonthData[];
}

const LineChart: React.FC<LineChartProps> = ({ monthsData }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const labels = monthsData.map((data) => data.month_name);
    const revenues = monthsData.map((data) => data.total_revenue);
    const expenditures = monthsData.map((data) => data.total_expenditure);

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Revenue",
            data: revenues,
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false,
          },
          {
            label: "Total Expenditure",
            data: expenditures,
            borderColor: "rgba(255, 99, 132, 1)",
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [monthsData]);

  return <canvas id="rev-exp-canva" className="rev-exp-canva" ref={chartRef} />;
};

export default LineChart;
