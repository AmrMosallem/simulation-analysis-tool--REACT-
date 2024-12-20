

import React from "react";
import { Line, Bar } from "react-chartjs-2";
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
} from "chart.js";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MNChart = ({ simulationData }) => {
    // Extract data for the chart
    const days = simulationData.map((data) => data.day);
    const beginningInventory = simulationData.map((data) => data.beginningInventory);
    const demandQuantity = simulationData.map((data) => data.demand);
    const endingInventory = simulationData.map((data) => data.endingInventory);
    const shortageQuantity = simulationData.map((data) => data.shortage);
    const orderQuantity = simulationData.map((data) => data.orderQuantity);

    const chartData = {
        labels: days,
        datasets: [
            {
                type: "line",
                label: "Beginning Inventory",
                data: beginningInventory,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.3,
                yAxisID: "y",
            },
            {
                type: "line",
                label: "Ending Inventory",
                data: endingInventory,
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                tension: 0.3,
                yAxisID: "y",
            },
            {
                type: "bar",
                label: "Demand Quantity",
                data: demandQuantity,
                backgroundColor: "rgba(255, 99, 132, 0.7)",
                borderWidth: 1,
                yAxisID: "y",
            },
            {
                type: "bar",
                label: "Shortage Quantity",
                data: shortageQuantity,
                backgroundColor: "rgba(255, 159, 64, 0.7)",
                borderWidth: 1,
                yAxisID: "y",
            },
            {
                type: "bar",
                label: "Order Quantity (N days)",
                data: orderQuantity,
                backgroundColor: "rgba(153, 102, 255, 0.7)",
                borderWidth: 1,
                barPercentage: 0.6,
                yAxisID: "y",
            },
        ],
    };

    // Chart Options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "M/N Simulation: Inventory and Order Analysis Over Time",
            },
            legend: {
                position: "top",
            },
            tooltip: {
                mode: "index",
                intersect: false,
            },
        },
        scales: {
            x: {
                title: { display: true, text: "Days" },
            },
            y: {
                title: { display: true, text: "Quantity" },
                beginAtZero: true,
            },
        },
    };

    return (

        <Line data={chartData} options={options} />

    );
};




export default MNChart