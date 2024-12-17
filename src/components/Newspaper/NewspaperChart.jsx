
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const NewspaperChart = ({tableData}) => {
  const labels = tableData.map((entry) => `Day ${entry["Day"]}`);
  const dailyProfit = tableData.map((entry) => entry["Daily Profit"]);
  const fulfillmentRate = tableData.map((entry) => entry["Fulfillment Rate %"]);
  const idleStock = tableData.map((entry) => entry["Idle Stock %"]);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Daily Profit',
        data: dailyProfit,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: 'Fulfillment Rate (%)',
        data: fulfillmentRate,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: 'Idle Stock (%)',
        data: idleStock,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Insights: Profit, Fulfillment, and Inventory Efficiency',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Values',
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;

}

export default NewspaperChart