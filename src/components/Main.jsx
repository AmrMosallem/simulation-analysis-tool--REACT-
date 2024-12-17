
import { Flex, Input, Button, Tabs, Text } from "@chakra-ui/react"
import { useState, useRef, useEffect } from "react";
import { systems } from "@/assets/constants";
import { motion } from "framer-motion";
import { FancyButton } from "./Shared"
import Import from "./Import";
import Export from "./Export";
const TextMotionComponent = motion.create(Text);
export default function Main({ activeSlideIndex, titleText }) {
    const [title, setTitle] = useState("");

    useEffect(() => {
        systems.forEach((system, index) => {
            if (index === activeSlideIndex) {
                setTitle(system.title);
            }
        })

    })
    useEffect(() => {
        if (titleText.current) {
            titleText.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [])
    return (
        <Flex direction={"column"} align={"center"} gap={10} minHeight={"100vh"}>
            <TextMotionComponent
                pt={20} ref={titleText} textStyle={'6xl'} fontWeight={"semibold"} letterSpacing={"2px"}
                initial={{
                    filter: "drop-shadow(0px 0px 5px white) drop-shadow(0px 0px 15px white)",
                }}
                animate={{
                    filter: "drop-shadow(0px 0px 5px transparent) drop-shadow(0px 0px 15px transparent)",
                }}
                transition={{
                    duration: 2.5,
                    ease: "easeIn",
                }}


            >{title}</TextMotionComponent>


            <Tabs.Root defaultValue="import" width={"900px"} variant="plain" size={"lg"} fitted={true}>
                <Tabs.List bg="bg.muted" rounded="l5" p="1" >
                    <Tabs.Trigger value="import" >
                        Import Data
                    </Tabs.Trigger>
                    <Tabs.Trigger value="export">
                        Export Data
                    </Tabs.Trigger>
                    <Tabs.Indicator rounded="l2" />
                </Tabs.List>
                <Tabs.Content value="import">
                    <Import activeSlideIndex={activeSlideIndex} />
                </Tabs.Content>
                <Tabs.Content value="export">
                    <Export activeSlideIndex={activeSlideIndex} />
                </Tabs.Content>
            </Tabs.Root>

        </Flex>
    )
}