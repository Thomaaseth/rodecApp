"use client"
import { Text, Box, Container, useColorModeValue, Stack } from '@chakra-ui/react'

const Footer = () => {
    return (
        <Box
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}>
            <Container
                as={Stack}
                maxW={'6xl'}
                py={4}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={'center'}
                align={'center'}>
                <Text>All rights reserved &copy; RoDec {new Date().getFullYear()}</Text>
            </Container>
        </Box>
    )
}

export default Footer