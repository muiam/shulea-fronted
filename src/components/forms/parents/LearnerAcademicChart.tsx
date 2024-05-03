import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface AcademicAchievement {
  exam_name: string;
  total_score: number;
  academic_year: string;
}

interface LineChartProps {
  yearData: AcademicAchievement[];
}

const LearnerAcademicChart: React.FC<LineChartProps> = ({ yearData }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const labels = yearData.map((data) => data.exam_name);
    const totalMarks = yearData.map((data) => data.total_score);
    // const yearName = yearData[0].academic_year;

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Marks",
            data: totalMarks,
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            // text: `${yearName} performance`,
          },
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [yearData]);

  return <canvas ref={chartRef} />;
};

export default LearnerAcademicChart;
