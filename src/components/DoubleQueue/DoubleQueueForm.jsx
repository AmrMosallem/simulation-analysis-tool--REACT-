import React, { useState } from 'react'

import { Box, Flex, Input, Grid, Text, Button, IconButton, Heading } from '@chakra-ui/react'
import { Field } from '../ui/field'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'

import { motion } from 'framer-motion'
import { shortAnimation } from '@/assets/constants'
const FlexMotionComponent = motion.create(Flex)
const DoubleQueueForm = ({ initialServicesOne = [], initialServicesTwo = [], initialInterarrivals = [], initialNumberOfCustomers = 0 }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [services, setServices] = useState(initialServicesOne.length ? initialServicesOne : [{ id: 1 }]);
    const [interarrivals, setInterarrivals] = useState(initialInterarrivals.length ? initialInterarrivals : [{ id: 1 }]);
    const [errorMessage, setErrorMessage] = useState('');
    function handleClick(data) {

        data.servicesOne = data.servicesOne.map((service) => ({
            time: parseFloat(service.time),
            probability: parseFloat(service.probability),
        }));
        data.servicesTwo = data.servicesTwo.map((service) => ({
            time: parseFloat(service.time),
            probability: parseFloat(service.probability),
        }));
        data.interarrivals = data.interarrivals.map((interarrival) => ({
            time: parseFloat(interarrival.time),
            probability: parseFloat(interarrival.probability),
        }));
        data.numberOfCustomers = parseFloat(data.numberOfCustomers);
        console.log(data);

        let totalServerOneServiceProbability = 0,
            totalServerTwoServiceProbability = 0;
        for (let i = 0; i < data.servicesOne.length; i++) {
            totalServerOneServiceProbability += data.servicesOne[i].probability;
            totalServerTwoServiceProbability += data.servicesTwo[i].probability;
        };

        let totalInterarrivalProbability = 0;
        for (let i = 0; i < data.interarrivals.length; i++) {
            totalInterarrivalProbability += data.interarrivals[i].probability;
        }
        totalInterarrivalProbability = totalInterarrivalProbability.toFixed(2);
        totalServerOneServiceProbability = totalServerOneServiceProbability.toFixed(2);
        totalServerTwoServiceProbability = totalServerTwoServiceProbability.toFixed(2);
        if (!data.servicesOne.length) {
            setErrorMessage("Please add at least one service.");
            return
        }
        else if (!data.interarrivals.length) {
            setErrorMessage("Please add at least one interarrival.");
            return
        }
        else if (data.servicesOne.some((service) => service.time <= 0 || service.probability <= 0)
         ||data.servicesTwo.some((service) => service.time <= 0 || service.probability <= 0)
         || data.interarrivals.some((interarrival) => interarrival.time <= 0 || interarrival.probability <= 0)) {
            setErrorMessage("Please enter valid values for all fields.");
            return
        }
        else if (totalServerOneServiceProbability != 1 || totalServerTwoServiceProbability != 1) {
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
        setErrorMessage('');
    }
    return (
        <FlexMotionComponent initial={{
            opacity: 0,
            y: 15,
        }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{
                duration: shortAnimation,
                ease: "easeOut"
            }} as={'form'} direction={"column"} gap={4} pb={20} onSubmit={handleSubmit(handleClick)}>
            <Heading textStyle={"2xl"}>Server One Services</Heading>
            <Grid templateColumns='repeat(4, 1fr)' gapX={6} gapY={2} pb={4}>

                <Text></Text><Text>Time</Text><Text>Probability</Text><Text></Text>
                {services.map((service, index) => (
                    <React.Fragment key={service.id}>
                        <Text>Service {service.id}: </Text>
                        <Input defaultValue={service.time} {...register(`servicesOne.${index}.time`, { required: true })} />
                        <Input defaultValue={service.probability} {...register(`servicesOne.${index}.probability`, { required: true })} />
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
            <Heading textStyle={"2xl"}>Server Two Services</Heading>
            <Grid templateColumns='repeat(4, 1fr)' gapX={6} gapY={2} pb={4}>

                <Text></Text><Text>Time</Text><Text>Probability</Text><Text></Text>
                {services.map((service, index) => (
                    <React.Fragment key={service.id}>
                        <Text>Service {service.id}: </Text>
                        <Input defaultValue={service.time} {...register(`servicesTwo.${index}.time`, { required: true })} />
                        <Input defaultValue={service.probability} {...register(`servicesTwo.${index}.probability`, { required: true })} />
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

export default DoubleQueueForm