import React from 'react'
import { Box, Flex, Heading, Text, List } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, BadgeCheck, BadgeAlert, Badge } from 'lucide-react';
import { motion } from 'framer-motion';
import { shortAnimation } from '@/assets/constants';
const FlexMotionComponent = motion.create(Flex);
const NewspaperScores = ({ scores }) => {
    console.log(scores);
    let overallScoreState = "",
        overallScoreColor = "";
    if (scores["Overall Score"] >= 92) {
        overallScoreState = "Excellent";
        overallScoreColor = "#61ff61";
    }
    else if (scores["Overall Score"] >= 82) {
        overallScoreState = "Very Good";
        overallScoreColor = "#b3ff61";
    }
    else if (scores["Overall Score"] >= 72) {
        overallScoreState = "Good";
        overallScoreColor = "#fffa61";
    }
    else if (scores["Overall Score"] >= 62) {
        overallScoreState = "Average";
        overallScoreColor = "#ffba61";
    }
    else if (scores["Overall Score"] >= 52) {
        overallScoreState = "Poor";
        overallScoreColor = "#ff6161";
    }
    else {
        overallScoreState = "Very Poor";
        overallScoreColor = "#ff4949";
    }

    const scoreInfo = {
        score: scores["Overall Score"],
        scoreState: overallScoreState,
        scoreColor: overallScoreColor
    }
    const scoreMetrics = scores.metrics;
    const scoreMetricsKeys = Object.keys(scoreMetrics);
    const scoreMetricsValues = Object.values(scoreMetrics);
    let profitabilityScore = { initialSentence: "Profaitability is", state: "", color: "", sentence: "", icon: "" };
    let efficiencyScore = { initialSentence: "Efficiency is", state: "", color: "", sentence: "", icon: "" };
    let demandFulfillmentScore = { initialSentence: "Demand Fulfillment is", state: "", color: "", sentence: "", icon: "" };
    let lossManagementScore = { initialSentence: "Loss Management is", state: "", color: "", sentence: "", icon: "" };

    if (scoreMetrics["Profitability Score"] > 80) {
        profitabilityScore = {
            state: "Good",
            color: "#61ff61",
            sentence: "newspaper is performing well and generating strong profits.",
            icon: <BadgeCheck size={20} color='#61ff61' />
        }
    }
    else if (scoreMetrics["Profitability Score"] > 60) {
        profitabilityScore = {
            state: "Average",
            color: "#fcff61",
            sentence: "newspaper is making a moderate profit, but there's room for improvement.",
            icon: <Badge size={20} color='#fcff61' />
        }
    }
    else {
        profitabilityScore = {
            state: "Poor",
            color: "#ff6161",
            sentence: "newspaper is not making a profit; consider improving the operations.",
            icon: <BadgeAlert size={20} color='#ff6161' />
        }
    }
    if (scoreMetrics["Efficiency Score"] > 80) {
        efficiencyScore = {
            state: "Good",
            color: "#61ff61",
            sentence: "newspaper's stock efficiency is high, indicating good resource management.",
            icon: <BadgeCheck size={20} color='#61ff61' />
        }
    } else if (scoreMetrics["Efficiency Score"] > 60) {
        efficiencyScore = {
            state: "Average",
            color: "#fcff61",
            sentence: "newspaper's stock efficiency is moderate; there's room for optimization.",
            icon: <Badge size={20} color='#fcff61' />
        }
    } else {
        efficiencyScore = {
            state: "Poor",
            color: "#ff6161",
            sentence: "newspaper's stock efficiency is low; consider improving inventory management.",
            icon: <BadgeAlert size={20} color='#ff6161' />
        }
    }

    // Demand Fulfillment Score
    if (scoreMetrics["Demand Fulfillment Score"] > 80) {
        demandFulfillmentScore = {
            state: "Good",
            color: "#61ff61",
            sentence: "newspaper's demand fulfillment is excellent, meeting customer needs effectively.",
            icon: <BadgeCheck size={20} color='#61ff61' />
        }
    } else if (scoreMetrics["Demand Fulfillment Score"] > 60) {
        demandFulfillmentScore = {
            state: "Average",
            color: "#fcff61",
            sentence: "newspaper's demand fulfillment is moderate; consider improving availability.",
            icon: <Badge size={20} color='#fcff61' />
        }
    } else {
        demandFulfillmentScore = {
            state: "Poor",
            color: "#ff6161",
            sentence: "newspaper's demand fulfillment is poor; improve stock availability to meet demand.",
            icon: <BadgeAlert size={20} color='#ff6161' />
        }
    }

    // Loss Management Score
    if (scoreMetrics["Loss Management Score"] > 80) {
        lossManagementScore = {
            state: "Good",
            color: "#61ff61",
            sentence: "newspaper's loss management is effective, minimizing waste and inefficiencies.",
            icon: <BadgeCheck size={20} color='#61ff61' />
        }
    } else if (scoreMetrics["Loss Management Score"] > 60) {
        lossManagementScore = {
            state: "Average",
            color: "#fcff61",
            sentence: "newspaper's loss management is average; some losses could be reduced.",
            icon: <Badge size={20} color='#fcff61' />
        }
    } else {
        lossManagementScore = {
            state: "Poor",
            color: "#ff6161",
            sentence: "newspaper's loss management is poor; focus on minimizing losses and waste.",
            icon: <BadgeAlert size={20} color='#ff6161' />
        }
    }

    const subScores = [profitabilityScore, efficiencyScore, demandFulfillmentScore, lossManagementScore];
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
                    {/* <List.Item>
                        <List.Indicator asChild color={customerWaitingPerformance.color}>

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
                    </List.Item> */}
                    {subScores.map((subScore, index) => (
                        <List.Item key={index}>
                            <List.Indicator asChild color={subScore.color}>
                                {subScore.icon}
                            </List.Indicator>
                            <Text>{subScore.initialSentence} <Box as={"span"} color={subScore.color}> {subScore.state}</Box>, {subScore.sentence}</Text>
                        </List.Item>
                    ))}
                </List.Root>
            </Flex>
        </FlexMotionComponent>
    )
}

export default NewspaperScores