import { useRef, useEffect } from "react"
import { Chart } from "chart.js/auto";

export default function QueueChart({ data }) {

    const chartRef = useRef(null);
    function getCustomerCountsAndPresence(events) {
        const timePoints = {};
        let currentCustomers = new Set();

        // Track changes to customers at each time point
        events.forEach((event) => {
            if (!timePoints[event.time])
                timePoints[event.time] = {
                    delta: 0,
                    customers: new Set([...currentCustomers]),
                };
            timePoints[event.time].delta += event.type === "Arrival" ? 1 : -1;
               
            if (event.type === "Arrival") {
                currentCustomers.add(event.customerID);
            } else {
                currentCustomers.delete(event.customerID);
            }
            // Store the current customers for this time
            timePoints[event.time].customers = new Set([...currentCustomers]);
        });

        // Sort time points and compute cumulative customer counts
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
                customers: Array.from(timePoints[time].customers), // Convert Set to Array
            });
        });

        return customerCounts;
    }

    useEffect(() => {
        const customerCounts = getCustomerCountsAndPresence(data);
        // Prepare labels and data for the step chart
        const labels = [];
        const data2 = [];
        const customerLabels = [];

        // Populate labels and data for each step interval
        customerCounts.forEach((entry, index) => {
            labels.push(entry.time); // Time at the start of the interval
            data2.push(entry.count); // Customer count at that time
            customerLabels.push(entry.customers.join(", ") || "None"); // List of customers

            // Add an extra point to maintain the step effect
            if (index < customerCounts.length - 1) {
                labels.push(customerCounts[index + 1].time);
                data2.push(entry.count);
                customerLabels.push(entry.customers.join(", ") || "None");
            }
        });
        const ctx = chartRef.current.getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Customer IDs",
                        data: data2,
                        fill: false,
                        borderColor: "white",
                        borderWidth: 2,
                        stepped: true, // Create the step-like effect
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            // Customize the tooltip to show customers at each time
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
                        ticks: {
                            stepSize: 1,
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "No. of Customers",
                        },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                        },
                    },
                },
            },
        });
    })


    return (
        <canvas ref={chartRef}>
        </canvas>
    )
}