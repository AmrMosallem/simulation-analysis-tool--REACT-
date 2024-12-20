import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

export default function QueueChart({ data }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null); // To store and clean up Chart instance

    // Function to process data
    function getCustomerCountsAndPresence(events) {
        const timePoints = {};
        let currentCustomers = new Set();

        events.forEach((event) => {
            if (!timePoints[event.time]) {
                timePoints[event.time] = {
                    delta: 0,
                    customers: new Set([...currentCustomers]),
                };
            }
            timePoints[event.time].delta += event.type === "Arrival" ? 1 : -1;

            if (event.type === "Arrival") {
                currentCustomers.add(event.customerID);
            } else {
                currentCustomers.delete(event.customerID);
            }

            timePoints[event.time].customers = new Set([...currentCustomers]);
        });

        const times = Object.keys(timePoints)
            .map(Number)
            .sort((a, b) => a - b);

        const customerCounts = [];
        let currentCount = 0;

        times.forEach((time) => {
            currentCount += timePoints[time].delta;
            customerCounts.push({
                time,
                count: currentCount,
                customers: Array.from(timePoints[time].customers),
            });
        });

        return customerCounts;
    }

    useEffect(() => {
        const customerCounts = getCustomerCountsAndPresence(data);

        const labels = [];
        const dataPoints = [];
        const customerLabels = [];

        customerCounts.forEach((entry, index) => {
            labels.push(entry.time);
            dataPoints.push(entry.count);
            customerLabels.push(entry.customers.join(", ") || "None");

            if (index < customerCounts.length - 1) {
                labels.push(customerCounts[index + 1].time);
                dataPoints.push(entry.count);
                customerLabels.push(entry.customers.join(", ") || "None");
            }
        });

        const ctx = chartRef.current.getContext("2d");

        // Destroy existing chart instance if it exists
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Create a new Chart instance
        chartInstanceRef.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Number of Customers",
                        data: dataPoints,
                        borderColor: "white",
                        borderWidth: 2,
                        stepped: true,
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                const index = tooltipItem.dataIndex;
                                const time = labels[index];
                                const customers = customerLabels[index];
                                return `Time: ${time}, Customer IDs: ${customers}`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Clock Time",
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Number of Customers",
                        },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                        },
                    },
                },
            },
        });

        // Cleanup chart instance on unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data]); // Re-run effect when `data` changes

    return <canvas ref={chartRef}></canvas>;
}
