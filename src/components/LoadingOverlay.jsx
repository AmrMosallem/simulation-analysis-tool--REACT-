import React from 'react'
import { Flex,Box, Text } from '@chakra-ui/react'
import { InfinitySpin } from 'react-loader-spinner'
const LoadingOverlay = ({ isLoading }) => {
    return (
        <Flex opacity={isLoading ? 1 : 0}
         pointerEvents={isLoading ? "all" : "none"}
          transition={"all .6s"} zIndex={1000} direction={"column"} justify={"center"} align={"center"} position={"fixed"} height={"100vh"} width={"100vw"} bg={"var(--darker)"}>
           <Box scale={1.5}> <InfinitySpin visible={true}
                width="190"
                color="white"
                ariaLabel="infinity-spin-loading" />
            </Box>
            <Text textStyle={"2xl"} color={"white"}>Getting things ready for you...</Text>
        </Flex>
    )
}

export default LoadingOverlay