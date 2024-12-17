import { Button, Box, Text, Flex, Image } from '@chakra-ui/react';
import { ColorModeButton } from '@/components/ui/color-mode';
import GlowingBorder from '@/components/GlowingBorder';
import { FancyButton } from './Shared';
import { motion } from "motion/react"
import React from 'react';
import rocket from '@/assets/rocket.png'
import { longAnimation } from '@/assets/constants';
const MotionComponent = motion.create(Box)
function Welcome(props) {


    return (
        <Flex transition={"all 1s"} bgColor={{ base: '#ffff', _dark: 'var(--darker)' }} height={'100vh'}
            direction={"column"} alignItems={'center'} justifyContent={'center'} gap={10}>
            <Text textStyle={'3xl'}>Hello, Ready to analyze your data?</Text>

            <FancyButton content={"Get Started"} onClick={props.directToSelect} />
            <MotionComponent filter={"drop-shadow(0px 0px 30px white) drop-shadow(0px 0px 100px var(--primary))"} position={'fixed'} bg={'var(--darkest)'} height={'280%'} width={'110%'} borderTopRadius={'2000px'}
                zIndex={2}
                initial={{ y: "97%" }}
                animate={{ y: props.welcomeOverlayVisible ? "0" : "97%" }}
                transition={{ duration: longAnimation, ease: "circIn", }}
            >
                <Image filter={"drop-shadow(0px 0px 15px white) drop-shadow(0px 0px 25px var(--primary))"} src={rocket} position={'absolute'} height={"20%"} left={'50%'} top={'-170px'} transform={'translate(-50%, -100%) '} />
            </MotionComponent>
        </Flex>
    );
}

export default Welcome;