import { Button, Box, Text, Flex, Image } from '@chakra-ui/react';
import { systems } from '@/assets/constants';
import { CarouselSwiper } from './CarouselSwiper';
import React from 'react';
import { motion } from 'framer-motion';
import { FancyButton } from './Shared';
import Main from './Main';
import { longAnimation } from '@/assets/constants';
const TextMotionComponent = motion.create(Text),
    FlexMotionComponent = motion.create(Flex);

export default function Select({ setActiveSlideIndex, directToMain }) {

    return (
        <Flex height={'100vh'}

            direction={"column"} justifyContent={'center'} gap={10}>
            <TextMotionComponent
                animate={{
                    opacity: [0, 1, 1, 1],
                    y: [40, -10, -10, 0],
                    scale: [0.5, 2, 2.02, 1],

                    filter: ["drop-shadow(0px 0px 5px white)", "drop-shadow(0px 0px 5px white)", "drop-shadow(0px 0px 5px white)", "drop-shadow(0px 0px 20px transparent)"],
                }}
                transition={{
                    duration: longAnimation,
                    times: [0, 0.25, 0.65, 1],
                    ease: "easeInOut",

                }}
                alignSelf={'center'} textStyle={'4xl'}>Select a System and Let Start Analyzing!</TextMotionComponent>
            <FlexMotionComponent direction={"column"} justifyContent={'center'}
                gap={10}
                initial={
                    {
                        opacity: 0,
                        y: 20,
                        scale: 0.9

                    }
                }
                animate={
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1
                    }
                }
                transition={{
                    duration: 0.4,
                    delay: longAnimation - 0.4,
                    ease: "easeOut",
                }}

            ><CarouselSwiper data={systems} setActiveSlideIndex={setActiveSlideIndex} />
                <FancyButton content={"Select"} onClick={directToMain} /></FlexMotionComponent>


        </Flex>
    );
}