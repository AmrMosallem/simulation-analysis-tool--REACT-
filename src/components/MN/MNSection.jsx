
import React from 'react'
import MNChart from './MNChart';
import MNTable from './MNTable';
import MNScores from './MNScores';
import MNMetrics from './MNMetrics';
import { getMNdata, getMNOverallScore, getMNDerivedMetrics } from '@/assets/excelFunctions';
import { Flex, Text, Tabs } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { shortAnimation } from '@/assets/constants';
const FlexMotionComponent = motion.create(Flex);
const MNSection = ({ worksheet }) => {
    const data = getMNdata(worksheet),
        overallScore = getMNOverallScore(data.daysData),
        metrics = getMNDerivedMetrics(data.daysData);
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
                    direction={"column"}
                    gap={10} >
                    <Flex height={"60dvh"} direction={"column"} gap={8} my={10}>
                        <MNChart simulationData={data.daysData} />
                    </Flex>
                    <MNTable daysData={data.daysData} />

                </FlexMotionComponent>
            </Tabs.Content>
            <Tabs.Content
                value="analytics">
                <MNMetrics derivedData={metrics} />
            </Tabs.Content>
            <Tabs.Content value="score">
                <MNScores scores={overallScore} />
            </Tabs.Content>
            <Tabs.Content value="form">

            </Tabs.Content>

        </>
    )
}

export default MNSection