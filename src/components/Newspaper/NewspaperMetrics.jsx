import React from 'react'
import { Card, Flex, Heading } from '@chakra-ui/react'
import { motion } from 'framer-motion';
import { shortAnimation } from '@/assets/constants';
const FlexMotionComponent = motion.create(Flex);
const NewspaperMetrics = ({ derivedData }) => {

    let metricsData = {
        "Summary of Total Metrics for Newspaper Sales Simulation": {},
        "Average Performance Metrics for Newspaper Sales Simulation": {},
    }
    for (const el in derivedData) {
        if (el.toLowerCase().includes("total")) {
            metricsData["Summary of Total Metrics for Newspaper Sales Simulation"][el] = derivedData[el];
        }
        else {
            metricsData["Average Performance Metrics for Newspaper Sales Simulation"][el] = derivedData[el];
        }
    }

    let boxes = [];
    for (const el in metricsData) {
        let cards = [];
        for (const card in metricsData[el]) {
            cards.push(
                <Card.Root width="300px" size={"sm"} filter={"drop-shadow(0 0 5px white)"} rounded={"2xl"}>
                    <Card.Body textAlign={"left"} gap="2" justifyContent={"space-between"} >
                        <Card.Title mt="2" textStyle={"xl"}>{card}</Card.Title>
                        <Card.Description textStyle={"3xl"} textAlign={"right"} fontWeight={"bold"} color={"white"}>
                            {card.toLowerCase().includes("%") ? `${metricsData[el][card]}%` :
                                metricsData[el][card]}
                        </Card.Description>
                    </Card.Body>
                </Card.Root>
            )
        }
        boxes.push(
            <Flex direction={"column"} align={"center"} gap={10}>
                <Heading size={"3xl"}>{el}</Heading>
                <Flex wrap={"wrap"} gap={10} justify={"center"}>
                    {cards}</Flex>
            </Flex>)
    }
    return (
        <FlexMotionComponent
            initial={{
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
            direction={"column"} gap={20} >
            {boxes}
        </FlexMotionComponent>
    )
}

export default NewspaperMetrics