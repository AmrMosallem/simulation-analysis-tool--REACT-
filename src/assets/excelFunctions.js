import ExcelJS from "exceljs";

function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr; // Base case: if the array has 1 or 0 elements, it's already sorted
  }

  // Split the array into two halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // Recursively split & merge the left and right halves
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let resultArray = [];
  let leftIndex = 0;
  let rightIndex = 0;

  // Compare elements from left and right arrays, and merge them in sorted order
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex].time < right[rightIndex].time) {
      resultArray.push(left[leftIndex]);
      leftIndex++; // Move left pointer forward
    } else {
      resultArray.push(right[rightIndex]);
      rightIndex++; // Move right pointer forward
    }
  }

  // Concat remaining elements (if any)
  return resultArray
    .concat(left.slice(leftIndex)) // If there are any remaining elements in the left array
    .concat(right.slice(rightIndex)); // If there are any remaining elements in the right array
}

function findCell(worksheet, value) {
  let row, column;
  if (!Array.isArray(value)) {
    for (let i = 1; i <= worksheet.rowCount; i++) {
      for (let j = 1; j <= worksheet.columnCount; j++) {
        if (
          `${worksheet.getCell(i, j).value}`
            .toLowerCase()
            .includes(value.toLowerCase())
        ) {
          row = i;
          column = j;
          return {
            row: row,
            column: column,
          };
        }
      }
    }
  } else {
    for (let i = 1; i <= worksheet.rowCount; i++) {
      for (let j = 1; j <= worksheet.columnCount; j++) {
        for (let k = 0; k < value.length; k++) {
          if (
            `${worksheet.getCell(i, j).value}`
              .toLowerCase()
              .includes(value[k].toLowerCase())
          ) {
            row = i;
            column = j;
            return {
              row: row,
              column: column,
            };
          }
        }
      }
    }
  }
  return null;
}

function findCells(worksheet, value) {
  let row, column;
  let arr = [];
  for (let i = 1; i <= worksheet.rowCount; i++) {
    for (let j = 1; j <= worksheet.columnCount; j++) {
      if (
        `${worksheet.getCell(i, j).value}`
          .toLowerCase()
          .includes(value.toLowerCase())
      ) {
        row = i;
        column = j;
        arr.push({ row: row, column: column });
      }
    }
  }
  return arr.length ? arr : null;
}
function getCellValue(cell) {
  return cell.type === ExcelJS.ValueType.Formula
    ? cell.value.result
    : cell.value;
}
function setTitle(cell, name) {
  cell.value = name;
  cell.style = {
    font: {
      size: 16,
      bold: true,
    },
    alignment: {
      vertical: "middle",
      horizontal: "center",
    },
  };
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE699" },
  };
}

// Function to read an Excel file
// export async function readExcelFile(file) {
//   const workbook = new ExcelJS.Workbook();

//   // Reading the file from input
//   const reader = new FileReader();

//   reader.onload = async function (e) {
//     const arrayBuffer = e.target.result;

//     // Load the array buffer into ExcelJS workbook
//     await workbook.xlsx.load(arrayBuffer);

//     // Access the first worksheet
//     const worksheet = workbook.getWorksheet(1);
//     return worksheet;
//   };

//   // Read the file as an ArrayBuffer
//   reader.readAsArrayBuffer(file);
// }

export async function readExcelFile(file) {
  const workbook = new ExcelJS.Workbook();

  // Reading the file from input
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async function (e) {
      try {
        const arrayBuffer = e.target.result;

        // Load the array buffer into ExcelJS workbook
        await workbook.xlsx.load(arrayBuffer);

        // Access the first worksheet
        const worksheet = workbook.getWorksheet(1);

        resolve(worksheet); // Resolve the promise with the worksheet
      } catch (error) {
        reject(error); // Reject the promise if there’s an error
      }
    };

    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
}

export function getDataLocation(worksheet, object) {
  let returnedObject = {};
  for (const element in object) {
    returnedObject = {
      [element]: findCell(worksheet, object[element]),
      ...returnedObject,
    };
  }

  return returnedObject;
}

export function getQueueingSystemData(worksheet) {
  const locations = getDataLocation(worksheet, {
    upperRow: ["customer", "cust."],
    customerIDCell: [
      "Customer ID",
      "Customer No.",
      "Customer Number",
      "Customer",
      "Cust. Id",
    ],
    arrivalTimeCell: ["arrival time"],
    startTimeCell: "start",
    serviceDurationCell: ["service time", "service duration", "service"],
    endTimeCell: "end",
  });
  console.log("locations", locations);
  let data = [];
  for (let i = locations.upperRow.row + 1; i <= worksheet.rowCount; i++) {
    const customerIDCell = worksheet.getCell(
        i,
        locations.customerIDCell.column
      ),
      arrivalTimeCell = worksheet.getCell(i, locations.arrivalTimeCell.column),
      startTimeCell = worksheet.getCell(i, locations.startTimeCell.column),
      serviceDurationCell = worksheet.getCell(
        i,
        locations.serviceDurationCell.column
      ),
      endTimeCell = worksheet.getCell(i, locations.endTimeCell.column);
    const customer = {
      customerID: getCellValue(customerIDCell),
      arrivalTime: getCellValue(arrivalTimeCell) || 0,
      startTime: getCellValue(startTimeCell) || 0,
      serviceDuration: getCellValue(serviceDurationCell),
      endTime: getCellValue(endTimeCell),
      waitingTime:
        (getCellValue(startTimeCell) || 0) -
        (getCellValue(arrivalTimeCell) || 0),
      idleTime: data.length
        ? getCellValue(startTimeCell) - data[data.length - 1].endTime
        : 0,
    };
    if (!customer.customerID) continue;
    data.push(customer);
  }
  console.log("Queuing System Data: ", data);
  return data;
}

export function getQueueingSystemTableData(data) {
  let tableData = [];
  data.forEach((el) => {
    tableData.push({
      type: "Arrival",
      customerID: el.customerID,

      time: el.arrivalTime,
    });
    tableData.push({
      type: "Departure",
      customerID: el.customerID,
      time: el.endTime,
    });
  });
  tableData = mergeSort(tableData);
  console.log(tableData);
  return tableData;
}
export function getQueuingSystemDerivedMetrics(data) {
  let totalWaitingTime = 0,
    customersWaiting = 0,
    totalIdleTime = 0,
    totalServiceTime = 0;
  data.forEach((el) => {
    totalWaitingTime += el.waitingTime;
    if (el.waitingTime) customersWaiting++;
    totalIdleTime += el.idleTime;
    totalServiceTime += el.serviceDuration;
  });

  const numberOfCustomers = data.length,
    systemStartTime = data[0].startTime,
    systemEndTime = data[data.length - 1].endTime,
    averageWaitingTime = totalWaitingTime / numberOfCustomers,
    averageWaitingTimeForWaitingCustomer = customersWaiting
      ? totalWaitingTime / customersWaiting
      : 0,
    waitingProbability = customersWaiting / numberOfCustomers,
    averageIdleTime = totalIdleTime / numberOfCustomers,
    idleProbability = totalIdleTime / (systemEndTime - systemStartTime),
    averageServiceTime = totalServiceTime / numberOfCustomers;
  const derivedData = {
    "Simulation Information": {
      "Number of Customers": numberOfCustomers,
      "System Start Time": systemStartTime,
      "System End Time": systemEndTime,
    },
    "Waiting Information": {
      "Total Waiting Time": totalWaitingTime,
      "Number of Customers Waiting": customersWaiting,
      "Average Waiting Time": averageWaitingTime,
      "Average Waiting Time (For Waiting Customers)":
        averageWaitingTimeForWaitingCustomer,
      "Waiting Probability": waitingProbability,
    },
    "System Information": {
      "Average System Idle Time": averageIdleTime,
      "Total System Idle Time": totalIdleTime,
      "System Idle Probability": idleProbability,
      "Total Service Time": totalServiceTime,
      "Average Service Time": averageServiceTime,
    },
  };
  console.log("Derived Data", derivedData);
  return derivedData;
}

export function getQueuingSystemScore(data) {
  const {
    "Waiting Information": waitingInfo,
    "System Information": systemInfo,
    "Simulation Information": simulationInfo,
  } = data;

  // Normalize metrics (0–1 scale)
  const maxWaitingTime =
    (simulationInfo["Number of Customers"] - 1) *
    systemInfo["Average Service Time"]; // Example max waiting time for normalization
  const maxIdleTime =
    simulationInfo["System End Time"] - simulationInfo["System Start Time"]; // Example max idle time for normalization

  const normalizedMetrics = {
    "Total Waiting Time Score":
      waitingInfo["Total Waiting Time"] / maxWaitingTime,
    "Number of Customers Waiting Score":
      waitingInfo["Number of Customers Waiting"] /
      simulationInfo["Number of Customers"], // Assume max 100 customers
    "Average Waiting Time Score":
      waitingInfo["Average Waiting Time"] / maxWaitingTime,
    "Average Waiting Time (For Waiting Customers) Score":
      waitingInfo["Average Waiting Time (For Waiting Customers)"] /
      maxWaitingTime,
    "Waiting Probability Score": waitingInfo["Waiting Probability"],

    "Average System Idle Time Score":
      systemInfo["Average System Idle Time"] / maxIdleTime,
    "Total System Idle Time Score":
      systemInfo["Total System Idle Time"] / maxIdleTime,
    "System Idle Probability Score": systemInfo["System Idle Probability"],
  };

  // Assign weights to metrics
  const weights = {
    "Total Waiting Time Score": 0.2,
    "Number of Customers Waiting Score": 0.15,
    "Average Waiting Time Score": 0.2,
    "Average Waiting Time (For Waiting Customers) Score": 0.15,
    "Waiting Probability Score": 0.1,
    "Average System Idle Time Score": 0.1,
    "Total System Idle Time Score": 0.05,
    "System Idle Probability Score": 0.05,
  };

  // Calculate weighted score (lower score is better)
  let totalScore = 0;
  for (const [metric, weight] of Object.entries(weights)) {
    totalScore += normalizedMetrics[metric] * weight;
  }

  // Invert the score so higher is better
  const finalScore = 100 - totalScore * 100; // Scale to 0–100 range

  let rawMetricsScore = {};
  for (const [metric, value] of Object.entries(normalizedMetrics)) {
    rawMetricsScore[metric] = Math.round((100 - value * 100) * 100) / 100;
  }

  return {
    score: Math.round(Math.max(0, Math.min(100, finalScore) * 100)) / 100,
    scoreMetrics: rawMetricsScore,
  }; // Ensure score stays in bounds
}

export function getNewspaperProblemData(worksheet) {
  const locations = getDataLocation(worksheet, {
    supplyCell: ["supply", "q"],
    costCell: "cost",
    salvageCell: ["salvage", "scrap", "excess"],
    upperRowCell: "day number",
    dayCell: "day number",
    typeCell: "type of newsday",
    demandCell: "demand quantity",
  });
  const supply = getCellValue(
      worksheet.getCell(
        locations.supplyCell.row,
        locations.supplyCell.column + 1
      )
    ),
    cost = getCellValue(
      worksheet.getCell(locations.costCell.row, locations.costCell.column + 1)
    ),
    salvage = getCellValue(
      worksheet.getCell(
        locations.salvageCell.row,
        locations.salvageCell.column + 1
      )
    );

  let daysData = [];
  for (let i = locations.upperRowCell.row + 1; i <= worksheet.rowCount; i++) {
    const dayNumber = getCellValue(
        worksheet.getCell(i, locations.dayCell.column)
      ),
      type = getCellValue(worksheet.getCell(i, locations.typeCell.column)),
      demand = getCellValue(worksheet.getCell(i, locations.demandCell.column)),
      revenue = Math.min(demand, supply) * cost,
      lostProfitFromExcessDemand =
        demand > supply ? (demand - supply) * cost : 0,
      salvageSale = supply > demand ? (supply - demand) * salvage : 0,
      dailyProfit = revenue + salvageSale - lostProfitFromExcessDemand,
      remainingNewspapers = Math.max(supply - demand, 0),
      netProfit = revenue + salvageSale,
      trueLost = remainingNewspapers * (cost - salvage),
      fullLost = trueLost + lostProfitFromExcessDemand,
      fulfillmentRate = (Math.min(demand, supply) / demand) * 100, // Indicates how well the system meets customer demand.
      idleStockPercentage = (remainingNewspapers / supply) * 100, // Measures stock inefficiency and overproduction.
      dailyLossRate = (fullLost / (demand * cost)) * 100, // Indicates how much profit is lost each day.
      overstockPercentage = (remainingNewspapers / demand) * 100, // Measures how much of the supply was not required, relative to the demand.
      excessDemandRate =
        demand > supply ? ((demand - supply) / demand) * 100 : 0, //Reflects the percentage of demand that could not be fulfilled due to insufficient supply.
      stockEfficiency = (Math.min(demand, supply) / supply) * 100, //  Indicates the percentage of supplied newspapers that were sold, representing effective use of inventory.
      totalPotentialProfit = demand * cost; // The maximum profit that could be achieved if all demand was met and no overstock occurred.
    let dayData = {
      Day: dayNumber,
      Type: type,
      Demand: demand,
      Revenue: revenue,
      "Lost Profit from Excess Demand": lostProfitFromExcessDemand,
      "Salvage Sale": salvageSale,
      "Daily Profit": dailyProfit,
      "Remaining Newspapers": remainingNewspapers,
      "Net Profit": netProfit,
      "True Lost": trueLost,
      "Full Lost": fullLost,
      "Fulfillment Rate %": fulfillmentRate,
      "Idle Stock %": idleStockPercentage,
      "Daily Loss %": dailyLossRate,
      "Overstock %": overstockPercentage,
      "Excess Demand %": excessDemandRate,
      "Stock Efficiency %": stockEfficiency,
      "Total Potential Profit": totalPotentialProfit,
    };
    Object.keys(dayData).forEach((key) => {
      if (typeof dayData[key] === "number")
        dayData[key] = Math.round(dayData[key] * 10) / 10;
    });
    daysData.push(dayData);
  }

  const data = {
    supply: supply,
    cost: cost,
    salvage: salvage,
    daysData: daysData,
  };
  console.log(data);
  return data;
}

export function getNewspaperProblemTableData(data) {
  let daysData = [];
  for (let i = 0; i < data.daysData.length; i++) {
    daysData.push({
      Day: data.daysData[i]["Day"],
      Type: data.daysData[i]["Type"],
      Demand: data.daysData[i]["Demand"],
      Revenue: data.daysData[i]["Revenue"],
      "Daily Profit": data.daysData[i]["Daily Profit"],
      "Fulfillment Rate %": data.daysData[i]["Fulfillment Rate %"],
      "Idle Stock %": data.daysData[i]["Idle Stock %"],
      "Excess Demand %": data.daysData[i]["Excess Demand %"],
      "Stock Efficiency %": data.daysData[i]["Stock Efficiency %"],
      "Daily Loss %": data.daysData[i]["Daily Loss %"],
      "Total Potential Profit": data.daysData[i]["Total Potential Profit"],
    });
  }
  return daysData;
}
export function getNewspaperProblemDerivedMetrics(daysData) {
  let totalRevenue = 0,
    totalSalvageSale = 0,
    totalLostProfitFromExcessDemand = 0,
    totalDailyProfit = 0,
    totalRemainingNewspapers = 0,
    totalTrueLoss = 0,
    totalFullLoss = 0,
    totalDemand = 0,
    totalFulfillmentRate = 0,
    totalIdleStockPercentage = 0,
    totalDailyLossRate = 0,
    totalOverstockPercentage = 0,
    totalExcessDemandRate = 0,
    totalStockEfficiency = 0,
    totalPotentialProfit = 0;

  const numDays = daysData.length;

  daysData.forEach((day) => {
    totalRevenue += day["Revenue"];
    totalSalvageSale += day["Salvage Sale"];
    totalLostProfitFromExcessDemand += day["Lost Profit from Excess Demand"];
    totalDailyProfit += day["Daily Profit"];
    totalRemainingNewspapers += day["Remaining Newspapers"];
    totalTrueLoss += day["True Lost"];
    totalFullLoss += day["Full Lost"];
    totalDemand += day["Demand"];
    totalFulfillmentRate += day["Fulfillment Rate %"];
    totalIdleStockPercentage += day["Idle Stock %"];
    totalDailyLossRate += day["Daily Loss %"];
    totalOverstockPercentage += day["Overstock %"];
    totalExcessDemandRate += day["Excess Demand %"];
    totalStockEfficiency += day["Stock Efficiency %"];
    totalPotentialProfit += day["Total Potential Profit"];
  });

  const averageDailyProfit = totalDailyProfit / numDays;
  const averageFulfillmentRate = totalFulfillmentRate / numDays;
  const averageIdleStockPercentage = totalIdleStockPercentage / numDays;
  const averageDailyLossRate = totalDailyLossRate / numDays;
  const averageOverstockPercentage = totalOverstockPercentage / numDays;
  const averageExcessDemandRate = totalExcessDemandRate / numDays;
  const averageStockEfficiency = totalStockEfficiency / numDays;

  let derivedData = {
    "Total Revenue": totalRevenue,
    "Total Salvage Sale": totalSalvageSale,
    "Total Lost Profit from Excess Demand": totalLostProfitFromExcessDemand,
    "Total Daily Profit": totalDailyProfit,
    "Total Remaining Newspapers": totalRemainingNewspapers,
    "Total True Loss": totalTrueLoss,
    "Total Full Loss": totalFullLoss,
    "Total Demand": totalDemand,
    "Total Potential Profit": totalPotentialProfit,
    "Average Daily Profit": averageDailyProfit,
    "Average Fulfillment Rate %": averageFulfillmentRate,
    "Average Idle Stock %": averageIdleStockPercentage,
    "Average Daily Loss %": averageDailyLossRate,
    "Average Overstock %": averageOverstockPercentage,
    "Average Excess Demand %": averageExcessDemandRate,
    "Average Stock Efficiency %": averageStockEfficiency,
  };
  for (const el in derivedData) {
    if (typeof derivedData[el] === "number")
      derivedData[el] = Math.round(derivedData[el] * 10) / 10;
  }
  console.log("Newspaper Problem Derived Metrics", derivedData);
  return derivedData;
}

export function getNewspaperProblemScores(data) {
  function calculateProfitabilityScore(data) {
    const maxPossibleProfit = data["Total Potential Profit"];
    const actualProfit = data["Total Daily Profit"];
    return (actualProfit / maxPossibleProfit) * 100; // Normalize to a 0-100 scale
  }

  // Helper function to calculate efficiency score
  function calculateEfficiencyScore(data) {
    const stockEfficiency = data["Average Stock Efficiency %"];
    const idleStockPenalty = 100 - data["Average Idle Stock %"]; // Higher idle stock reduces efficiency
    return stockEfficiency * 0.7 + idleStockPenalty * 0.3; // Weighted combination of sub-scores
  }

  // Helper function to calculate demand fulfillment score
  function calculateDemandFulfillmentScore(data) {
    const fulfillmentRate = data["Average Fulfillment Rate %"];
    const excessDemandPenalty = 100 - data["Average Excess Demand %"]; // Excess demand lowers the score
    return fulfillmentRate * 0.8 + excessDemandPenalty * 0.2; // Weighted combination
  }

  // Helper function to calculate loss management score
  function calculateLossManagementScore(data) {
    const dailyLossRate = 100 - data["Average Daily Loss %"]; // Lower daily loss rate means better performance
    const overstockPenalty = 100 - data["Average Overstock %"]; // Overstock reduces score
    return dailyLossRate * 0.6 + overstockPenalty * 0.4; // Weighted combination
  }

  // Assign scores for each key metric
  const profitabilityScore = calculateProfitabilityScore(data);
  const efficiencyScore = calculateEfficiencyScore(data);
  const demandFulfillmentScore = calculateDemandFulfillmentScore(data);
  const lossManagementScore = calculateLossManagementScore(data);

  // Define weights for each metric category
  const weights = {
    profitability: 0.4,
    efficiency: 0.3,
    demandFulfillment: 0.2,
    lossManagement: 0.1,
  };

  // Calculate the overall score as a weighted average
  const overallScore =
    profitabilityScore * weights.profitability +
    efficiencyScore * weights.efficiency +
    demandFulfillmentScore * weights.demandFulfillment +
    lossManagementScore * weights.lossManagement;

  // Round the overall score to 2 decimal places

  return {
    "Overall Score": overallScore.toFixed(2),
    metrics: {
      "Profitability Score": profitabilityScore.toFixed(2),
      "Efficiency Score": efficiencyScore.toFixed(2),
      "Demand Fulfillment Score": demandFulfillmentScore.toFixed(2),
      "Loss Management Score": lossManagementScore.toFixed(2),
    },
  };
}

export function exportQueueingSystemData(data) {
  console.log("data", data);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Simulation");

  worksheet.mergeCells("A1", "E1");
  worksheet.getCell("A1").value = "Arrival Probability";
  worksheet.mergeCells("G1", "K1");
  worksheet.getCell("G1").value = "Service Probability";

  worksheet.addRow([
    "Interarrival",
    "Probability",
    "Cumulative Probability",
    "From",
    "To",
    "",
    "Time",
    "Probability",
    "Cumulative Probability",
    "From",
    "To",
  ]);

  for (let i = 3; i < data.interarrivals.length + 3; i++) {
    const interarrival = data.interarrivals[i - 3];
    worksheet.getCell(`A${i}`).value = interarrival.time;
    worksheet.getCell(`B${i}`).value = interarrival.probability;
    worksheet.getCell(`C${i}`).value =
      i === 3
        ? interarrival.probability
        : {
            formula: `B${i} + C${i - 1}`,
          };
    worksheet.getCell(`D${i}`).value =
      i === 3
        ? 1
        : {
            formula: `E${i - 1} + 1`,
          };
    worksheet.getCell(`E${i}`).value = {
      formula: `C${i} * 100`,
    };
    for (let i = 3; i < data.services.length + 3; i++) {
      const service = data.services[i - 3];
      worksheet.getCell(`G${i}`).value = service.time;
      worksheet.getCell(`H${i}`).value = service.probability;
      worksheet.getCell(`I${i}`).value =
        i === 3
          ? service.probability
          : {
              formula: `H${i} + I${i - 1}`,
            };
      worksheet.getCell(`J${i}`).value =
        i === 3
          ? 1
          : {
              formula: `K${i - 1} + 1`,
            };
      worksheet.getCell(`K${i}`).value = {
        formula: `I${i} * 100`,
      };
    }
  }
  const upperRow =
      Math.max(data.interarrivals.length, data.services.length) + 4,
    interarrivalLastRow = data.interarrivals.length + 2,
    serviceLastRow = data.services.length + 2;
  [
    "Customer No.",
    "Rand. Digit",
    "Interarriv. Time",
    "Arrival Time",
    "Start Time",
    "Rand. Digit",
    "Service Duration",
    "End Time",
    "Cust. Waiting Time",
    "Server Idle Time",
    "Cust. Spent Time",
  ].forEach((header, index) => {
    worksheet.getCell(upperRow, index + 1).value = header;
  });

  for (let i = upperRow + 1; i <= upperRow + data.numberOfCustomers; i++) {
    const customerNo = i - upperRow;
    worksheet.getCell(i, 1).value = customerNo;
    worksheet.getCell(i, 2).value = { formula: `RANDBETWEEN(1,100)` };
    worksheet.getCell(i, 3).value = {
      formula: `LOOKUP(B${i}, $D$3:$E$${interarrivalLastRow}, $A$3:$A$${interarrivalLastRow})`,
    };
    worksheet.getCell(i, 4).value = {
      formula: i == upperRow + 1 ? `C${i}` : `C${i}+D${i - 1}`,
    };
    worksheet.getCell(i, 5).value = {
      formula: i == upperRow + 1 ? `C${i}` : `MAX(D${i},H${i - 1})`,
    };

    worksheet.getCell(i, 6).value = { formula: `RANDBETWEEN(1,100)` };
    worksheet.getCell(i, 7).value = {
      formula: `LOOKUP(F${i}, $J$3:$K$${serviceLastRow}, $G$3:$G$${serviceLastRow})`,
    };
    worksheet.getCell(i, 8).value = {
      formula: `E${i} + G${i}`,
    };
    worksheet.getCell(i, 9).value = {
      formula: `E${i} - D${i}`,
    };
    worksheet.getCell(i, 10).value = {
      formula: i == upperRow + 1 ? `0` : `E${i}-H${i - 1}`,
    };
    worksheet.getCell(i, 11).value = {
      formula: `H${i} - D${i}`,
    };
  }
  worksheet.eachRow((row, rowNumber) => {
    worksheet.getRow(rowNumber).eachCell((cell) => {
      cell.font = {
        size: 14,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });
  });

  let boldRows = [1, 2, upperRow];
  for (let i = 0; i < boldRows.length; i++) {
    worksheet.getRow(boldRows[i]).eachCell((cell) => {
      cell.font = {
        size: 16,
        bold: true,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE699" },
      };
    });
  }
  worksheet.columns.forEach((column) => {
    column.width = 24;
  });
  workbook.xlsx.writeBuffer().then(function (buffer) {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "System Simulation Analysis.xlsx";
    link.click();
  });
}

export function getQueueingSystemProbability(worksheet) {
  const locations = getDataLocation(worksheet, {
    upperRow: "interarrival",
    interarrival: "interarrival",
    serviceTime: "time",
    upperRow2: ["customer", "cust"],
  });
  console.log(locations);
  let interarrivals = [];

  for (let i = locations.upperRow.row + 1; i < locations.upperRow2.row; i++) {
    const time = getCellValue(
        worksheet.getCell(i, locations.interarrival.column)
      ),
      probability = getCellValue(
        worksheet.getCell(i, locations.interarrival.column + 1)
      );
    if (time && probability) {
      interarrivals.push({
        time: time,
        probability: probability,
        id: i - locations.upperRow.row,
      });
    }
  }
  let services = [];
  for (let i = locations.upperRow.row + 1; i < locations.upperRow2.row; i++) {
    const time = getCellValue(
        worksheet.getCell(i, locations.serviceTime.column)
      ),
      probability = getCellValue(
        worksheet.getCell(i, locations.serviceTime.column + 1)
      );
    if (time && probability) {
      services.push({
        time: time,
        probability: probability,
        id: i - locations.upperRow.row,
      });
    }
  }
  let numberOfCustomers = 0;
  for (let i = locations.upperRow2.row + 1; i <= worksheet.rowCount; i++) {
    const value = getCellValue(worksheet.getCell(i, 1));
    numberOfCustomers++;
    if (!value && value !== 0 && value !== "0") {
      break;
    }
  }
  const probabilities = {
    numberOfCustomers: numberOfCustomers,
    interarrivals: interarrivals,
    services: services,
  };
  console.log(probabilities);
  return probabilities;
}

export function exportNewspaperProblemData(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Simulation");

  worksheet.mergeCells("H1", "J1");
  worksheet.getCell("H1").value = "Demand Probability Distribution";
  worksheet.mergeCells("K1", "M1");
  worksheet.getCell("K1").value = "Cumulative Probability";

  worksheet.mergeCells("N1", "O1");
  worksheet.getCell("N1").value = "Good";

  worksheet.mergeCells("P1", "Q1");
  worksheet.getCell("P1").value = "Fair";

  worksheet.mergeCells("R1", "S1");
  worksheet.getCell("R1").value = "Bad";

  worksheet.addRow([
    "Types of NewsDays",
    "NewsDay Probability",
    "Cumulative Probability",
    "From",
    "To",
    "",
    "Demand",
    "Good",
    "Fair",
    "Bad",
    "Good",
    "Fair",
    "Bad",
    "From",
    "To",
    "From",
    "To",
    "From",
    "To",
  ]);
  worksheet.getCell("A3").value = "Good";
  worksheet.getCell("B3").value = data.goodProbability;
  worksheet.getCell("A4").value = "Fair";
  worksheet.getCell("B4").value = data.fairProbability;
  worksheet.getCell("A5").value = "Bad";
  worksheet.getCell("B5").value = data.badProbability;
  worksheet.getCell("C3").value = { formula: `B3 ` };
  worksheet.getCell("C4").value = { formula: `B4 + C3` };
  worksheet.getCell("C5").value = { formula: `B5 + C4` };
  worksheet.getCell("D3").value = 1;
  worksheet.getCell("D4").value = { formula: `E3 + 1` };
  worksheet.getCell("D5").value = { formula: `E4 + 1` };
  worksheet.getCell("E3").value = { formula: `C3 * 100` };
  worksheet.getCell("E4").value = { formula: `C4 * 100` };
  worksheet.getCell("E5").value = { formula: `C5 * 100` };

  for (let i = 3; i < data.demand.length + 3; i++) {
    const demand = data.demand[i - 3];
    worksheet.getCell(`G${i}`).value = demand.quantity;
    worksheet.getCell(`H${i}`).value = demand.good;
    worksheet.getCell(`I${i}`).value = demand.fair;
    worksheet.getCell(`J${i}`).value = demand.bad;

    worksheet.getCell(`K${i}`).value = {
      formula: i == 3 ? `H${i}` : `H${i} + K${i - 1}`,
    };
    worksheet.getCell(`L${i}`).value = {
      formula: i == 3 ? `I${i}` : `I${i} + L${i - 1}`,
    };
    worksheet.getCell(`M${i}`).value = {
      formula: i == 3 ? `J${i}` : `J${i} + M${i - 1}`,
    };
    worksheet.getCell(`N${i}`).value = {
      formula: i == 3 ? 1 : `O${i - 1} + 1`,
    };
    worksheet.getCell(`O${i}`).value = { formula: `K${i} * 100` };

    worksheet.getCell(`P${i}`).value = {
      formula: i == 3 ? 1 : `Q${i - 1} + 1`,
    };
    worksheet.getCell(`Q${i}`).value = { formula: `L${i} * 100` };

    worksheet.getCell(`R${i}`).value = {
      formula: i == 3 ? 1 : `S${i - 1} + 1`,
    };
    worksheet.getCell(`S${i}`).value = { formula: `M${i} * 100` };
  }
  worksheet.mergeCells("U1", "V1");
  worksheet.getCell("U1").value = "Limits";

  worksheet.getCell("U2").value = "Number of Days";
  worksheet.getCell("V2").value = data.numberOfDays;
  worksheet.getCell("U3").value = "Supply";
  worksheet.getCell("V3").value = data.supply;
  worksheet.getCell("U4").value = "Cost";
  worksheet.getCell("V4").value = data.cost;
  worksheet.getCell("U5").value = "Salvage";
  worksheet.getCell("V5").value = data.salvage;

  const upperRow = worksheet.rowCount + 2;
  worksheet.getRow(upperRow).values = [
    " Day Number",
    "R.D for Type of Newsday",
    "Type of Newsday",
    "R.D. for Demand",
    "Demand Quantity",
    "Revenue From Sales",
    "Lost Profit from Excess Demand",
    "Salvage From Scrap Sale",
    "	Daily Profit",
    "Number of Remaining Newspapers",
    "Net Profit",
    "True Lost",
    "Full True Lost",
  ];
  const demandsLastRow = data.demand.length + 2;

  for (let i = upperRow + 1; i < upperRow + data.numberOfDays + 1; i++) {
    worksheet.getCell(`A${i}`).value = i - upperRow;
    worksheet.getCell(`B${i}`).value = { formula: `RANDBETWEEN($D$3, $E$5)` };
    worksheet.getCell(`C${i}`).value = {
      formula: `LOOKUP(B${i},$D$3:$E$5,$A$3:$A$5)`,
    };
    worksheet.getCell(`D${i}`).value = {
      formula: `RANDBETWEEN(1, 100)`,
    };
    worksheet.getCell(`E${i}`).value = {
      formula: `
    IF(C${i}="Good", LOOKUP(D${i},$N$3:$O$${demandsLastRow},$G$3:$G$${demandsLastRow}), IF(C${i}="Fair", LOOKUP(D${i},$P$3:$Q$${demandsLastRow},$G$3:$G$${demandsLastRow}),LOOKUP(D${i},$R$3:$S$${demandsLastRow},$G$3:$G$${demandsLastRow})))
    `,
    };
    worksheet.getCell(`F${i}`).value = {
      formula: `MIN(E${i},$V$3)*$V$4`,
    };
    worksheet.getCell(`G${i}`).value = {
      formula: `IF(E${i}>$V$3, (E${i}-$V$3)*$V$4,0)`,
    };
    worksheet.getCell(`H${i}`).value = {
      formula: `IF(E${i}<$V$3, ($V$3-E${i})*$V$5,0)`,
    };
    worksheet.getCell(`I${i}`).value = {
      formula: `F${i}+H${i}-G${i}`,
    };
    worksheet.getCell(`J${i}`).value = {
      formula: `MAX($V$3-E${i},0)`,
    };
    worksheet.getCell(`K${i}`).value = {
      formula: `F${i}+H${i}`,
    };
    worksheet.getCell(`L${i}`).value = {
      formula: `J${i}*($V$4-$V$5)`,
    };
    worksheet.getCell(`M${i}`).value = {
      formula: `L${i}+G${i}`,
    };
  }
  worksheet.eachRow((row, rowNumber) => {
    worksheet.getRow(rowNumber).eachCell((cell) => {
      cell.font = {
        size: 12,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });
  });

  let boldRows = [1, 2, upperRow];
  for (let i = 0; i < boldRows.length; i++) {
    worksheet.getRow(boldRows[i]).eachCell((cell) => {
      cell.font = {
        size: 14,
        bold: true,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE699" },
      };
    });
  }
  worksheet.columns.forEach((column) => {
    column.width = 24;
  });

  workbook.xlsx.writeBuffer().then(function (buffer) {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Newspaper Seller Simulation.xlsx";
    link.click();
  });
}

export function getNewspaperProblemFormData(worksheet) {
  const locations = getDataLocation(worksheet, {
    upperRow: "Demand Probability",
    numberOfDays: "Number of Days",
    supply: ["Supply", "Q"],
    cost: "Cost",
    salvage: ["Salvage", "Scrap", "Excess"],
    newsDayProbability: "NewsDay Probability",
  });
  locations.upperRow.row = locations.upperRow.row + 1;
  locations.upperRow.column = locations.upperRow.column - 1;
  console.log("form location", locations);
  const goodProbability = getCellValue(
      worksheet.getCell(
        locations.newsDayProbability.row + 1,
        locations.newsDayProbability.column
      )
    ),
    fairProbability = getCellValue(
      worksheet.getCell(
        locations.newsDayProbability.row + 2,
        locations.newsDayProbability.column
      )
    ),
    badProbability = getCellValue(
      worksheet.getCell(
        locations.newsDayProbability.row + 3,
        locations.newsDayProbability.column
      )
    ),
    numberOfDays = getCellValue(
      worksheet.getCell(
        locations.numberOfDays.row,
        locations.numberOfDays.column + 1
      )
    ),
    supply = getCellValue(
      worksheet.getCell(locations.supply.row, locations.supply.column + 1)
    ),
    cost = getCellValue(
      worksheet.getCell(locations.cost.row, locations.cost.column + 1)
    ),
    salvage = getCellValue(
      worksheet.getCell(locations.salvage.row, locations.salvage.column + 1)
    );

  let demand = [];
  for (let i = locations.upperRow.row + 1; i <= worksheet.rowCount; i++) {
    const demandQuantity = getCellValue(
        worksheet.getCell(i, locations.upperRow.column)
      ),
      good = getCellValue(worksheet.getCell(i, locations.upperRow.column + 1)),
      fair = getCellValue(worksheet.getCell(i, locations.upperRow.column + 2)),
      bad = getCellValue(worksheet.getCell(i, locations.upperRow.column + 3));
    if (
      demandQuantity == "" ||
      demandQuantity == null ||
      Number.isNaN(demandQuantity)
    )
      break;
    demand.push({
      quantity: demandQuantity,
      good: good,
      fair: fair,
      bad: bad,
      id: i - locations.upperRow.row,
    });
  }
  const data = {
    demand: demand,
    supply: supply,
    cost: cost,
    salvage: salvage,
    goodProbability: goodProbability,
    fairProbability: fairProbability,
    badProbability: badProbability,
    numberOfDays: numberOfDays,
  };
  console.log(data);
  return data;
}
