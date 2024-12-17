import { Table } from "@chakra-ui/react";



export default function QueueTable({ data }) {

    return (
        <Table.ScrollArea borderWidth="1px" rounded="md" height="60dvh">
            <Table.Root size="sm" stickyHeader interactive colorPalette={"white"}>
                <Table.Header>
                    <Table.Row bg="bg.subtle">
                        <Table.ColumnHeader>Event</Table.ColumnHeader>
                        <Table.ColumnHeader>Customer ID</Table.ColumnHeader>
                        <Table.ColumnHeader>Time</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data.map((item, index) => {
                        return (
                            <Table.Row key={ index}>
                                <Table.Cell>{item.type}</Table.Cell>
                                <Table.Cell>{item.customerID}</Table.Cell>
                                <Table.Cell>{item.time}</Table.Cell>
                            </Table.Row>)
                    })
                    }
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    )



}




