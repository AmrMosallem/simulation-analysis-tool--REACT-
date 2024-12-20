import React from 'react'
import { Table } from '@chakra-ui/react'
const MNTable = ({ daysData }) => {
    let cumulativeShortage = 0;

    const tableData = daysData.map((day, index) => {
        cumulativeShortage += day.shortage;
        const tableDay = {
            "Day": day.day,
            "Beginning Inventory": day.beginningInventory,
            "Demand Quantity": day.demand,
            "Ending Inventory": day.endingInventory,
            "Shortage Quantity": day.shortage,
            "Order Quantity": day.orderQuantity,
            "Cumulative Shortage": cumulativeShortage,
            "Fulfillment Rate %":
                day.demand > 0 ? ((day.demand - day.shortage) / day.demand) * 100 : 0,
            "Idle Stock Rate %":
                day.beginningInventory > 0
                    ? (day.endingInventory / day.beginningInventory) * 100
                    : 100,
        }
        for (const el in tableDay) {
            if (typeof tableDay[el] === "number") {
                tableDay[el] = Math.round(tableDay[el] * 100) / 100
            }
        }
        return tableDay;
      
    });
    console.log("daysData", daysData);
    console.log("Table Data", tableData);
    const tableDataKeys = Object.keys(tableData[0]);
    return (
        <Table.ScrollArea borderWidth="1px" rounded="md" height="55dvh">
            <Table.Root size="sm" stickyHeader interactive colorPalette={"white"}>
                <Table.Header>
                    <Table.Row bg="bg.subtle">
                        {tableDataKeys.map((key, index) => <Table.ColumnHeader key={index}>{key}</Table.ColumnHeader>)}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tableData.map((item, index) => (
                        <Table.Row key={index}>
                            {Object.values(item).map((value, index) => <Table.Cell key={index}>{value}{tableDataKeys[index].toLowerCase().includes("%") && value ? "%" : ""}</Table.Cell>)}
                        </Table.Row>))
                    }
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    )
}

export default MNTable