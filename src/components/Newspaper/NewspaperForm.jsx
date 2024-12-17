import React, { useState } from 'react'

import { Box, Flex, Input, Grid, Text, Button, IconButton } from '@chakra-ui/react'
import { Field } from '../ui/field'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { exportQueueingSystemData } from '@/assets/excelFunctions'
import { exportNewspaperProblemData } from '@/assets/excelFunctions'
const NewspaperForm = ({ initialValues, demand=[] }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [demands, setDemands] = useState(demand.length ? demand : [{ id: 1 }]); // Initial demand row
    const [errorMessage, setErrorMessage] = useState('');
    // Function to add a new demand row
    const addDemand = () => {
        setDemands((prev) => [...prev, { id: prev.length + 1 }]);
    };
    const deleteDemand = (id) => {
        setDemands((prev) => prev.filter((demand) => demand.id !== id));
    };


    function handleClick(data) {
        for (const el in data) {
            if (typeof data[el] === 'string')
                data[el] = parseFloat(data[el]);
        }
        data.demand = data.demand.map((demand) => ({
            quantity: parseFloat(demand.quantity),
            good: parseFloat(demand.good),
            fair: parseFloat(demand.fair),
            bad: parseFloat(demand.bad),
        }))
        console.log(data);
        let totalGood = 0;
        let totalFair = 0;
        let totalBad = 0;
        for (let i = 0; i < data.demand.length; i++) {
            totalGood += data.demand[i].good;
            totalFair += data.demand[i].fair;
            totalBad += data.demand[i].bad;
        }
        totalGood = totalGood.toFixed(2);
        totalFair = totalFair.toFixed(2);
        totalBad = totalBad.toFixed(2);


        if (data.numberOfDays <= 0 || data.supply <= 0 || data.cost <= 0 || data.salvage <= 0 || data.goodProbability <= 0 || data.fairProbability <= 0 || data.badProbability <= 0) {
            setErrorMessage("Please enter valid values for all fields.");
            return;
        }
        if (data.goodProbability + data.fairProbability + data.badProbability !== 1) {
            setErrorMessage("Good, Fair, and Bad probabilities must sum to 1." + (data.goodProbability + data.fairProbability + data.badProbability));
            return;
        }
        if (data.demand.some((demand) => demand.quantity <= 0)) {
            setErrorMessage("Please enter valid values for all demand probabilities.");
            return;
        }
        if (totalGood != 1 || totalFair != 1 || totalBad != 1) {
            setErrorMessage("Demands' Good, Fair, and Bad probabilities must sum to 1.");
            return;
        }
        exportNewspaperProblemData(data);
        setErrorMessage('');

    }
    return (
        <Flex as={"form"} onSubmit={handleSubmit(handleClick)} direction={"column"} gap={5}>
            <Grid templateColumns="repeat(2, 1fr)" gap={6} >
                <Field label="Number of Days" >
                    <Input defaultValue={initialValues?.numberOfDays} type="number" {...register("numberOfDays", { required: true })} step="any" />
                </Field>
                <Field label="Supply">
                    <Input defaultValue={initialValues?.supply} type="number" {...register("supply", { required: true })} step="any" />
                </Field>
                <Field label="Cost">
                    <Input defaultValue={initialValues?.cost} type="number" {...register("cost", { required: true })} step="any" />
                </Field>
                <Field label="Salvage">
                    <Input defaultValue={initialValues?.salvage} type="number" {...register("salvage", { required: true })} step="any" />
                </Field>

            </Grid>
            <Flex justifyContent="space-between" gap={5} >
                <Field label="Good Probability" >
                    <Input defaultValue={initialValues?.goodProbability} type="number" {...register("goodProbability", { required: true })} step="any" />
                </Field>
                <Field label="Fair Probability" >
                    <Input defaultValue={initialValues?.fairProbability} type="number" {...register("fairProbability", { required: true })} step="any" />
                </Field>
                <Field label="Bad Probability" >
                    <Input defaultValue={initialValues?.badProbability} type="number" {...register("badProbability", { required: true })} step="any" />
                </Field>
            </Flex>
            <Grid templateColumns="repeat(6, 1fr)" gapX={4} gapY={2} alignItems={"center"} >
                <Text></Text> <Text>Quantity</Text>
                <Text>Good Probability</Text>
                <Text>Fair Probability</Text>
                <Text>Bad Probability</Text>
                <Text></Text>
                {/* Map over the demands state to render input rows */}
                {demands.map((demand, index) => (
                    <React.Fragment key={demand.id}>
                        <Text>Demand {demand.id}:</Text>
                        <Input defaultValue={demand.quantity}
                            {...register(`demand[${index}].quantity`, { required: true })}
                            placeholder={`Demand ${demand.id} Quantity`} step="any"
                        />
                        <Input defaultValue={demand.good}
                            {...register(`demand[${index}].good`, { required: true })}
                            placeholder={`Good for Demand ${demand.id}`} step="any"
                        />
                        <Input defaultValue={demand.fair}
                            {...register(`demand[${index}].fair`, { required: true })}
                            placeholder={`Fair for Demand ${demand.id}`} step="any"
                        />
                        <Input defaultValue={demand.bad}
                            {...register(`demand[${index}].bad`, { required: true })}
                            placeholder={`Bad for Demand ${demand.id}`} step="any"
                        />
                        <IconButton
                            aria-label={`Delete Demand ${demand.id}`}
                            variant={"plain"}
                            onClick={() => deleteDemand(demand.id)}
                            width={8}

                        >
                            <X />
                        </IconButton>
                    </React.Fragment>
                ))}
                <Button mt={4} colorScheme="teal" onClick={addDemand}>
                    Add Demand
                </Button>
            </Grid>
            {errorMessage && <Text color="red">{errorMessage}</Text>}
            <Button alignSelf={"center"} colorScheme="blue" type="submit" >
                Export Data
            </Button>
        </Flex>
    )
}

export default NewspaperForm