"use client"
import React from 'react'
import { Box, Link, Flex, Text, Stack } from '@chakra-ui/react';
import NextLink from 'next/link'  // Rename to avoid name clash with Chakra UI's Link component
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {

    return (
        <Box bg="teal.500" px={4} color="white">
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Flex>
                    <Text fontSize="lg" fontWeight="bold">RoDec</Text>
                    <Stack direction={'row'} spacing={4} marginLeft={4}>
                        <NextLink href="/">
                            <Link fontWeight="bold" fontSize="lg">Home</Link>
                        </NextLink>
                        <NextLink href="/actions">
                            <Link fontWeight="bold" fontSize="lg">Nos actions</Link>
                        </NextLink>
                        <NextLink href="/donner">
                            <Link fontWeight="bold" fontSize="lg">Faire un don</Link>
                        </NextLink>
                        <NextLink href="/marketplace">
                            <Link fontWeight="bold" fontSize="lg">Marketplace NFT</Link>
                        </NextLink>
                    </Stack>
                </Flex>
                <ConnectButton />
            </Flex>
        </Box>

    )
}

export default Navbar
