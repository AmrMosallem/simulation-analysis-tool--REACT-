import React from 'react'
import { getNewspaperProblemData, getNewspaperProblemTableData, getNewspaperProblemDerivedMetrics, getNewspaperProblemScores, getNewspaperProblemFormData } from '@/assets/excelFunctions';
import NewspaperTable from './NewspaperTable';
import NewspaperChart from './NewspaperChart';
import NewspaperMetrics from './NewspaperMetrics';
import NewspaperScore from './NewspaperScores';
import NewspaperForm from './NewspaperForm';

import { Flex, Text, Tabs } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { shortAnimation } from '@/assets/constants';
import { form } from 'framer-motion/client';
const FlexMotionComponent = motion.create(Flex);
const NewspaperSection = ({ worksheet }) => {
  const data = getNewspaperProblemData(worksheet),
    tableData = getNewspaperProblemTableData(data),
    derivedData = getNewspaperProblemDerivedMetrics(data.daysData),
    scores = getNewspaperProblemScores(derivedData),
    formData = getNewspaperProblemFormData(worksheet);
  ;
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
          direction={"column"} gap={20}  >
          < Flex height={"60dvh"} direction={"column"} gap={8} my={10}>
            <Text textAlign={"center"} textStyle={'3xl'}>Newspaper Sales Analysis Chart</Text>
            <NewspaperChart tableData={tableData} />
          </Flex>
          <NewspaperTable tableData={tableData} />

        </FlexMotionComponent>
      </Tabs.Content>
      <Tabs.Content
        value="analytics">
        <NewspaperMetrics derivedData={derivedData} />
      </Tabs.Content>
      <Tabs.Content value="score">
        <NewspaperScore scores={scores} />
      </Tabs.Content>
      <Tabs.Content value="form">
        <NewspaperForm initialValues={formData} demand = {formData.demand} />
      </Tabs.Content>

    </>
  )
}

export default NewspaperSection