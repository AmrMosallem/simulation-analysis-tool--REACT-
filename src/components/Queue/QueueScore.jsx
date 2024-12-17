import React from 'react'
import { Box, Flex, Heading, Text, List } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, BadgeCheck, BadgeAlert, Badge } from 'lucide-react';
import { motion } from 'framer-motion';
import { shortAnimation } from '@/assets/constants';
const FlexMotionComponent = motion.create(Flex);
const QueueScore = ({ score }) => {
    console.log(score);
    let scoreState = "",
        scoreColor = "";
    if (score.score >= 92) {
        scoreState = "Excellent";
        scoreColor = "#61ff61";
    }
    else if (score.score >= 82) {
        scoreState = "Very Good";
        scoreColor = "#b3ff61";
    }
    else if (score.score >= 72) {
        scoreState = "Good";
        scoreColor = "#fffa61";
    }
    else if (score.score >= 62) {
        scoreState = "Average";
        scoreColor = "#ffba61";
    }
    else if (score.score >= 52) {
        scoreState = "Poor";
        scoreColor = "#ff6161";
    }
    else {
        scoreState = "Very Poor";
        scoreColor = "#ff4949";
    }


    const scoreInfo = {
        score: score.score,
        scoreState: scoreState,
        scoreColor: scoreColor
    }
    const scoreMetrics = score.scoreMetrics;
    const scoreMetricsKeys = Object.keys(scoreMetrics);
    const scoreMetricsValues = Object.values(scoreMetrics);
    let customerWaitingPerformance = { state: "", color: "", sentence: "", icon: "" };
    if (scoreMetrics["Number of Customers Waiting Score"] > 80) {
        customerWaitingPerformance = {
            state: "Good",
            color: "#61ff61",
            sentence: "no additional servers are needed.",
            icon: <BadgeCheck size={20} color='#61ff61' />
        }
    }
    else if (scoreMetrics["Number of Customers Waiting Score"] > 60) {  // Average
        customerWaitingPerformance = {
            state: "Average",
            color: "#fffa61",
            sentence: "it's recommended to add more servers.",
            icon: <Badge size={20} color='#fffa61' />
        }
    }
    else {  // Poor
        customerWaitingPerformance = {
            state: "Poor",
            color: "#ff6161",
            sentence: "it's necessary to add more servers.",
            icon: <BadgeAlert size={20} color='#ff6161' />
        }
    }

    let systemIdlePerformance = { state: "", color: "", sentence: "", icon: "" };
    if (scoreMetrics["Average System Idle Time Score"] > 80) {
        systemIdlePerformance = {
            state: "Good",
            color: "#61ff61",
            sentence: "the system is efficiently utilized.",
            icon: <BadgeCheck size={20} color='#61ff61' />
        }
    }
    else if (scoreMetrics["Average System Idle Time Score"] > 60) {  // Average
        systemIdlePerformance = {
            state: "Average",
            color: "#fffa61",
            sentence: "it's recommended to consider the system's utilization.",
            icon: <Badge size={20} color='#fffa61' />
        }
    }
    else {  // Poor
        systemIdlePerformance = {
            state: "Poor",
            color: "#ff6161",
            sentence: "it's necessary to consider the system's utilization.",
            icon: <BadgeAlert size={20} color='#ff6161' />
        }
    }

    return (
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
            }} gap={40} >
            <Flex direction={"column"} gap={6} >
                {
                    scoreMetricsKeys.map((key, index) => (
                        <Flex gap={6} align={"center"} justify={"space-between"} key={index}>
                            <Text>{key}: <Box as={"span"} color={scoreMetricsValues[index] > 50 ? "#61ff61" : "#ff6161"}> {scoreMetricsValues[index]}%</Box></Text>
                            {scoreMetricsValues[index] > 50 ?
                                <ArrowUp size={20} color='#61ff61' /> :
                                <ArrowDown size={20} color='#ff6161' />}</Flex>

                    ))
                }
            </Flex>
            <Flex direction={"column"} gap={2} align={"center"} flex={1} border={"2px solid #ffffff94"} rounded={"2xl"} p={41}>
                <Heading size={"5xl"} >Score</Heading>
                <Heading size={"7xl"} color={scoreInfo.scoreColor}>{scoreInfo.score}</Heading>
                <Heading size={"3xl"} color={scoreInfo.scoreColor} >{scoreInfo.scoreState}</Heading>
                <Text mt="5" textStyle={"2xl"}>Summary</Text>
                <List.Root gap="2" variant="plain" align="center">
                    <List.Item>
                        <List.Indicator asChild color={customerWaitingPerformance.color}>
                            {customerWaitingPerformance.icon}
                        </List.Indicator>
                        <Text>Customer waiting performance is
                            <Box as={"span"} color={customerWaitingPerformance.color}> {customerWaitingPerformance.state}</Box>,   {customerWaitingPerformance.sentence}</Text>
                    </List.Item>
                    <List.Item>
                        <List.Indicator asChild color={systemIdlePerformance.color}>
                            {systemIdlePerformance.icon}
                        </List.Indicator>
                        <Text>System idle performance is
                            <Box as={"span"} color={systemIdlePerformance.color}> {systemIdlePerformance.state}</Box>, {systemIdlePerformance.sentence}</Text>
                    </List.Item>
                </List.Root>
            </Flex>
        </FlexMotionComponent>
    )
}

export default QueueScore