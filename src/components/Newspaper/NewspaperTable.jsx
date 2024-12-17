import React from 'react'
import { Table } from '@chakra-ui/react'
const NewspaperTable = ({ tableData }) => {

    const tableDataKeys = Object.keys(tableData[0])


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

export default NewspaperTable