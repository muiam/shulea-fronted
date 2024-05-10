import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface Revenue {
  id: number;
  item_name: string;
  type: string;
  amount: number;
  percentage: number;
}
interface RevenuePieChartProps {
  revenueData: Revenue[];
}

const LedgerDoughnut: React.FC<RevenuePieChartProps> = ({ revenueData }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const labels = revenueData.map((data) => data.item_name);
    const percentages = revenueData.map((data) => data.percentage);

    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            label: "your school revenue Distribution",
            data: percentages,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: [
              "rgba(255, 0, 0, 0.3)",
              "rgba(0, 6, 0, 0.8)",
              "rgba(255, 255, 0, 0.8)",
              "rgba(128, 0, 0, 0.8)",
              "rgba(0, 0, 0, 0.8)",
              "rgba(255, 255, 255, 0.8)",
              "rgba(255, 165, 0, 0.8)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [revenueData]);

  return <canvas ref={chartRef} />;
};

export default LedgerDoughnut;
