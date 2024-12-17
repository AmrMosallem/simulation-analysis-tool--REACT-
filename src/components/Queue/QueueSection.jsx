import React from 'react'
import QueueTable from "./QueueTable";
import QueueChart from "./QueueChart";
import QueueMetrics from './QueueMetrics';
import QueueScore from './QueueScore';
import QueueForm from './QueueForm';
import { getQueueingSystemData, getQueueingSystemTableData, getQueuingSystemDerivedMetrics, getQueuingSystemScore, getQueueingSystemProbability } from "@/assets/excelFunctions";
import { Flex, Text, Tabs } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { shortAnimation } from '@/assets/constants';
const FlexMotionComponent = motion.create(Flex);

const QueueSection = ({ worksheet }) => {

    const tableData = getQueueingSystemTableData(getQueueingSystemData(worksheet)),
        derivedData = getQueuingSystemDerivedMetrics(getQueueingSystemData(worksheet)),
        score = getQueuingSystemScore(derivedData),
        probability = getQueueingSystemProbability(worksheet);
    return (
        <>
            <Tabs.Content
                value="charts">
                <FlexMotionComponent initial={{
                    opacity: 0,
                    y: 15
                }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: shortAnimation,
                        ease: "easeOut"
                    }}
                    direction={"column"}  >
                    <Flex height={"60dvh"} direction={"column"} gap={8} my={10}>
                        <Text textAlign={"center"} textStyle={'3xl'}>Customers Arrival and Departure Chart</Text>
                        <QueueChart data={tableData} />
                    </Flex>
                    <QueueTable data={tableData} />

                </FlexMotionComponent>
            </Tabs.Content>
            <Tabs.Content
                value="analytics">
                <QueueMetrics derivedData={derivedData} />
            </Tabs.Content>
            <Tabs.Content value="score">
                <QueueScore score={score} />
            </Tabs.Content>
            <Tabs.Content value="form">
                <QueueForm initialInterarrivals={probability.interarrivals} initialServices={probability.services} initialNumberOfCustomers={probability.numberOfCustomers}/>
            </Tabs.Content>

        </>
    )
}

export default QueueSection