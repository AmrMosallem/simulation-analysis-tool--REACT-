import React from 'react'
import { Box, Card, Center, Flex, Heading } from '@chakra-ui/react'
import { Boxes } from 'lucide-react';
import { motion } from 'framer-motion';
import { shortAnimation } from '@/assets/constants';
const FlexMotionComponent = motion.create(Flex);
const QueueMetrics = ({ derivedData }) => {
    let boxes = [];
    for (const el in derivedData) {
        let cards = [];
        for (const card in derivedData[el]) {
            cards.push(
                <Card.Root width="300px" size={"sm"} filter={"drop-shadow(0 0 5px white)"} rounded={"2xl"}>
                    <Card.Body textAlign={"left"} gap="2" justifyContent={"space-between"} >
                        <Card.Title mt="2" textStyle={"xl"}>{card}</Card.Title>
                        <Card.Description textStyle={"3xl"} textAlign={"right"} fontWeight={"bold"} color={"white"}>
                            {card.toLowerCase().includes("probability") ? `${Math.round(derivedData[el][card] * 100)}%` :
                                Math.round(derivedData[el][card] * 100) / 100}
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

export default QueueMetrics