import React from 'react'
import { Box, Flex, Heading, Text, List } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, BadgeCheck, BadgeAlert, Badge } from 'lucide-react';
import { motion } from 'framer-motion';
import { inventory, shortAnimation } from '@/assets/constants';
const FlexMotionComponent = motion.create(Flex);
const MNScores = ({ scores }) => {
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

    let fullfillmentRate = { initialSentence: "Fullfillment Rate is", state: "", color: "", sentence: "", icon: "" },
        shortageScore = { initialSentence: "Shortage Rate is", state: "", color: "", sentence: "", icon: "" },
        inventoryEfficiency = { initialSentence: "Inventory Efficiency is", state: "", color: "", sentence: "", icon: "" },
        orderConsistency = { initialSentence: "Order Consistency is", state: "", color: "", sentence: "", icon: "" };

    if (scoreMetrics["Fulfillment Rate"] > 80) {
        fullfillmentRate = {
            initialSentence: "Fulfillment Rate is",
            state: "High",
            color: "#61ff61",
            sentence: "Demand is well met. Maintain current strategies.",
            icon: <BadgeCheck size={20} color="#61ff61" />
        };
    } else if (scoreMetrics["Fulfillment Rate"] > 60) {
        fullfillmentRate = {
            initialSentence: "Fulfillment Rate is",
            state: "Moderate",
            color: "#fcff61",
            sentence: "Meeting demand, but consider optimizing supply.",
            icon: <Badge size={20} color="#fcff61" />
        };
    } else {
        fullfillmentRate = {
            initialSentence: "Fulfillment Rate is",
            state: "Low",
            color: "#ff6161",
            sentence: "Falling short. Improve supply chain efficiency.",
            icon: <BadgeAlert size={20} color="#ff6161" />
        };
    }

    if (scoreMetrics["Shortage Rate"] > 80) {
        shortageScore = {
            initialSentence: "Shortage Score is",
            state: "Good",
            color: "#61ff61",
            sentence: "Minimal shortages. Maintain current approach.",
             icon: <BadgeCheck size={20} color="#61ff61" />
        };
    } else if (scoreMetrics["Shortage Rate"] > 60) {
        shortageScore = {
            initialSentence: "Shortage Score is",
            state: "Moderate",
            color: "#fcff61",
            sentence: "Occasional shortages. Review inventory planning.",
            icon: <Badge size={20} color="#fcff61" />
        };
    } else {
        shortageScore = {
            initialSentence: "Shortage Score is",
            state: "Poor",
            color: "#ff6161",
            sentence: "Severe shortages. Increase supply to match demand.",
            icon: <BadgeAlert size={20} color="#ff6161" /> 
        };
    }

    if (scoreMetrics["Inventory Efficiency"] > 80) {
        inventoryEfficiency = {
            initialSentence: "Inventory Efficiency is",
            state: "High",
            color: "#61ff61",
            sentence: "Resources are well utilized. Continue monitoring.",
            icon: <BadgeCheck size={20} color="#61ff61" />
        };
    } else if (scoreMetrics["Inventory Efficiency"] > 60) {
        inventoryEfficiency = {
            initialSentence: "Inventory Efficiency is",
            state: "Moderate",
            color: "#fcff61",
            sentence: "Manageable inefficiencies. Optimize stock levels.",
            icon: <Badge size={20} color="#fcff61" />
        };
    } else {
        inventoryEfficiency = {
            initialSentence: "Inventory Efficiency is",
            state: "Low",
            color: "#ff6161",
            sentence: "Wasted resources. Improve inventory management.",
            icon: <BadgeAlert size={20} color="#ff6161" />
        };
    }

    if (scoreMetrics["Order Consistency"] > 80) {
        orderConsistency = {
            initialSentence: "Order Consistency is",
            state: "High",
            color: "#61ff61",
            sentence: "Orders are reliable. Maintain consistency.",
            icon: <BadgeCheck size={20} color="#61ff61" />
        };
    } else if (scoreMetrics["Order Consistency"] > 60) {
        orderConsistency = {
            initialSentence: "Order Consistency is",
            state: "Moderate",
            color: "#fcff61",
            sentence: "Orders vary slightly. Standardize processes.",
            icon: <Badge size={20} color="#fcff61" />
        };
    } else {
        orderConsistency = {
            initialSentence: "Order Consistency is",
            state: "Low",
            color: "#ff6161",
            sentence: "Inconsistent orders. Improve reliability.",
            icon: <BadgeAlert size={20} color="#ff6161" />
        };
    }


    const subScores = [
        fullfillmentRate,
        shortageScore,
        inventoryEfficiency,
        orderConsistency];
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

export default MNScores