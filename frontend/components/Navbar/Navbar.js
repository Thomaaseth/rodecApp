"use client"
import React from 'react'
import { Box, Link, Flex, Text, Stack } from '@chakra-ui/react';
import NextLink from 'next/link'  // Rename to avoid name clash with Chakra UI's Link component
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
    return (
        <Box bg="teal.500" px={4} color="white">
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Text fontSize="lg" fontWeight="bold">Logo</Text>
                <Stack direction={'row'} spacing={4}>
                    <NextLink href="/">
                        <Link>Home</Link>
                    </NextLink>
                    <NextLink href="/actions">
                        <Link>Nos actions</Link>
                    </NextLink>
                    <NextLink href="/donner">
                        <Link>Faire un don</Link>
                    </NextLink>
                    <NextLink href="/marketplace">
                        <Link>Marketplace NFT</Link>
                    </NextLink>
                    <ConnectButton />
                </Stack>
            </Flex>
        </Box>
    )
}

export default Navbar
