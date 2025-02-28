'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsCardProps {
  title: string;
  data: ChartData<'line'>;
}

export function FTRE_AnalyticsCard({ title, data }: AnalyticsCardProps) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(255, 255, 255)',
        },
      },
      title: {
        display: true,
        text: title,
        color: 'rgb(255, 255, 255)',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgb(255, 255, 255)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgb(255, 255, 255)',
        },
      },
    },
  };

  // Ensure data has the required structure
  const chartData: ChartData<'line'> = {
    labels: data.labels || [],
    datasets: data.datasets?.map(dataset => ({
      ...dataset,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
    })) || []
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
      <div className="h-[300px]">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
} 