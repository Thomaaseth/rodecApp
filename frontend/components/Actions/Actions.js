"use client"

import { Box, Flex, Text } from '@chakra-ui/react'
import Layout from '@components/Layout/Layout'
// import { useAccount } from 'wagmi'

const Actions = () => {

    // const { address } = useAccount();
    return (
        <>
            <Layout>
                <Box p={4}>
                    <Text fontSize="xl">Lorem Ipsum</Text>
                    {/* Put the content of your page here */}
                </Box>
            </Layout>
        </>
    )

}

export default Actions