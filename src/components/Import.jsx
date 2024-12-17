import { Input, Button, Text, Flex, Box, Tabs } from "@chakra-ui/react"
import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useRef, useState, useEffect, act } from "react"
import { FancyButton } from "./Shared";
import { readExcelFile } from "@/assets/excelFunctions";


import QueueSection from "./Queue/QueueSection";
import NewspaperSection from "./Newspaper/NewspaperSection";
import { InfinitySpin } from "react-loader-spinner";
import { transform } from "framer-motion";



export default function Import({ activeSlideIndex }) {
    const [analyzeIsVisible, setAnalyzeIsVisible] = useState(false);
    const [fileName, setFileName] = useState("No file uploaded.");

    const [tabContent, setTabContent] = useState(null)
    const inputFile = useRef(null);
    async function handleUpload() {
        const file = inputFile.current.files[0];
        const worksheet = await readExcelFile(file);

        setTimeout(() => {
            if (activeSlideIndex == 0) 
                setTabContent(<QueueSection worksheet={worksheet} />)
            else if (activeSlideIndex == 2) 
                setTabContent(<NewspaperSection worksheet={worksheet} />)
        }, 1000)



    }
    useEffect(() => {
        if (inputFile.current) {
            inputFile.current.addEventListener("change", () => {
                if (inputFile.current.files.length > 0) {
                    setAnalyzeIsVisible(true);
                    setFileName(inputFile.current.files[0].name);
                    setTabContent(null)
                }
                else {
                    setAnalyzeIsVisible(false);
                    setFileName("No file uploaded.");
                }
            });

        }
    }
    );
    return (
        <Flex w={"full"} align={"center"} direction={"column"} p={5} gap={10}>
            <Text textStyle={'2xl'}>Upload your excel file and let's analyze!</Text>
            <Input variant={"unstyled"} ref={inputFile} type="file" accept=".xls, .xlsx" on width={"20%"} hidden />
            <Flex direction={"column"} gap={4} align={"center"}>
                <Button size={"lg"} onClick={() => inputFile.current.click()}>Browse File</Button>
                <Text>{fileName}</Text>
            </Flex>
            <DialogRoot size="full" placement="center" motionPreset="slide-in-bottom"  scrollBehavior="inside">
                <DialogTrigger asChild>
                    <FancyButton content={"Analyze"} onClick={handleUpload} opacity={analyzeIsVisible ? 1 : 0} pointerEvents={analyzeIsVisible ? "auto" : "none"} />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Analysed Data</DialogTitle>
                        <DialogCloseTrigger />
                    </DialogHeader>
                    <DialogBody>
                        <Tabs.Root lazyMount unmountOnExit defaultValue="charts" width={"full"} variant="plain" size={"lg"} fitted={true}>
                            <Tabs.List bg="bg.muted" rounded="l5" p="1" >
                                <Tabs.Trigger value="charts" >
                                    Tables and Charts
                                </Tabs.Trigger>
                                <Tabs.Trigger value="analytics">
                                    Metrics
                                </Tabs.Trigger>
                                <Tabs.Trigger value="score">
                                    Score and Recommendations
                                </Tabs.Trigger>
                                <Tabs.Trigger value="form">
                                    Export New Worksheet
                                </Tabs.Trigger>
                                <Tabs.Indicator rounded="l2" />
                            </Tabs.List>
                            {tabContent ? tabContent : <Flex height={"50dvh"} direction={"column"} align={"center"} justify={"center"} gap={4}>
                                <Box scale={2}><InfinitySpin visible={true}
                                    width="190"
                                    color="white"
                                    ariaLabel="infinity-spin-loading" /></Box>
                                <Text textStyle={'2xl'} >Analyzing your file...</Text>
                            </Flex>}
                        </Tabs.Root>
                    </DialogBody>
                </DialogContent>
            </DialogRoot>

        </Flex>
    )
}