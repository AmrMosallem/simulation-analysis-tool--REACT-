import React, { useState } from 'react'

import { Box, Flex, Input, Grid, Text, Button, IconButton, Heading } from '@chakra-ui/react'
import { Field } from '../ui/field'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { exportQueueingSystemData } from '@/assets/excelFunctions'
import { motion } from 'framer-motion'
import { shortAnimation } from '@/assets/constants'
const FlexMotionComponent = motion.create(Flex)
const QueueForm = ({ initialServices = [], initialInterarrivals = [], initialNumberOfCustomers = 0 }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [services, setServices] = useState(initialServices.length ? initialServices : [{ id: 1 }]);
  const [interarrivals, setInterarrivals] = useState(initialInterarrivals.length ? initialInterarrivals : [{ id: 1 }]);
  const [errorMessage, setErrorMessage] = useState('');
  function handleClick(data) {

    data.services = data.services.map((service) => ({
      time: parseFloat(service.time),
      probability: parseFloat(service.probability),
    }));

    data.interarrivals = data.interarrivals.map((interarrival) => ({
      time: parseFloat(interarrival.time),
      probability: parseFloat(interarrival.probability),
    }));
    data.numberOfCustomers = parseFloat(data.numberOfCustomers);
    console.log(data);

    let totalServiceProbability = 0;
    for (let i = 0; i < data.services.length; i++) {
      totalServiceProbability += data.services[i].probability;
    }
    let totalInterarrivalProbability = 0;
    for (let i = 0; i < data.interarrivals.length; i++) {
      totalInterarrivalProbability += data.interarrivals[i].probability;
    }
    totalInterarrivalProbability = totalInterarrivalProbability.toFixed(2);
    totalServiceProbability = totalServiceProbability.toFixed(2);
    if (!data.services.length) {
      setErrorMessage("Please add at least one service.");
      return
    }
    else if (!data.interarrivals.length) {
      setErrorMessage("Please add at least one interarrival.");
      return
    }
    else if (data.services.some((service) => service.time <= 0 || service.probability <= 0) || data.interarrivals.some((interarrival) => interarrival.time <= 0 || interarrival.probability <= 0)) {
      setErrorMessage("Please enter valid values for all fields.");
      return
    }
    else if (totalServiceProbability != 1) {
      setErrorMessage("Service probabilities must sum to 1.");
      return
    }
    else if (totalInterarrivalProbability != 1) {
      setErrorMessage("Interarrival probabilities must sum to 1.");
      return
    }
    else if (data.numberOfCustomers <= 0) {
      setErrorMessage("Please enter a valid number of customers.");
      return
    }
    exportQueueingSystemData(data);
    setErrorMessage('');
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
      }} as={'form'} direction={"column"} gap={4} pb={20} onSubmit={handleSubmit(handleClick)}>
      <Heading textStyle={"2xl"}>Services</Heading>
      <Grid templateColumns='repeat(4, 1fr)' gapX={6} gapY={2} pb={4}>

        <Text></Text><Text>Time</Text><Text>Probability</Text><Text></Text>
        {services.map((service, index) => (
          <React.Fragment key={service.id}>
            <Text>Service {service.id}: </Text>
            <Input defaultValue={service.time} {...register(`services.${index}.time`, { required: true })} />
            <Input defaultValue={service.probability} {...register(`services.${index}.probability`, { required: true })} />
            <IconButton
              aria-label="Delete"
              variant={'plain'}
              onClick={() => {
                setServices(services.filter(s => s.id !== service.id));
              }}
            >
              <X />
            </IconButton>
          </React.Fragment>
        ))}

      </Grid>
      <Button onClick={() => {
        setServices([...services, { id: services.length + 1 }]);
      }} alignSelf={"center"}>Add Service</Button>
      <Heading textStyle={"2xl"}>Interarrivals</Heading>
      <Grid templateColumns='repeat(4, 1fr)' gapX={6} gapY={2}>
        <Text></Text><Text>Time</Text><Text>Probability</Text><Text></Text>
        {interarrivals.map((interarrival, index) => (
          <React.Fragment key={interarrival.id}>
            <Text>Interarrival {interarrival.id}: </Text>
            <Input defaultValue={interarrival.time} {...register(`interarrivals.${index}.time`, { required: true })} />
            <Input defaultValue={interarrival.probability} {...register(`interarrivals.${index}.probability`, { required: true })} />
            <IconButton
              aria-label="Delete"
              variant={'plain'}
              onClick={() => {
                setInterarrivals(interarrivals.filter(s => s.id !== interarrival.id));
              }}
            >
              <X />
            </IconButton>
          </React.Fragment>
        ))}
      </Grid>
      <Button onClick={() => {
        setInterarrivals([...interarrivals, { id: interarrivals.length + 1 }]);
      }} alignSelf={"center"}>Add Interarrival</Button>
      <Field label='Number of Customers:'>
        <Input defaultValue={initialNumberOfCustomers} {...register('numberOfCustomers', { required: true })} />
      </Field>
      {errorMessage && <Text color="red">{errorMessage}</Text>}
      <Button type='submit'>Export Data</Button>

    </FlexMotionComponent>
  )
}

export default QueueForm