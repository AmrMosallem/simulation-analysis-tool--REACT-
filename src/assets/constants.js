import rocket from "./rocket.png";

import queue from "./queue.jpg";
import queueDouble from "./queue-double.jpg";
import newspaper from "./newspaper.jpg";
import inventory from "./inventory.jpg";
import printer from "./printer.jpg";

export const systems = [
  {
    title: "Queuing System",
    image: queue,
    description:
      "A system to analyze and optimize single-server queues in service operations.",
  },
  {
    title: "Double-Server Queuing System",
    image: queueDouble,
    description:
      "Analyzes queuing systems with two servers to improve service efficiency.",
  },
  {
    title: "Newspaper Seller",
    image: newspaper,
    description:
      "A simulation of newspaper demand and inventory to optimize sales and reduce waste.",
  },
  {
    title: "M/N Inventory System",
    image: inventory,
    description:
      "Helps in managing and analyzing stock levels to ensure efficient inventory management.",
  },
  {
    title: "Printer System",
    image: printer,
    description: 'Focuses on the maintenance and analysis of printer components to ensure optimal performance.'
  },
];
const longAnimation = 1.8,

shortAnimation = .6; // 1.5
export { rocket, queue, queueDouble, newspaper, inventory, printer, longAnimation, shortAnimation };
