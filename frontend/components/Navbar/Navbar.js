"use client"
import { Box, Link, Flex, Text, Stack } from '@chakra-ui/react';
import NextLink from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { ethers } from "ethers";
import { getContractInstanceWithSigner, isOwner } from '@/contracts/donateContract';
import { useEffect, useState } from 'react';

const Navbar = () => {

    const { address } = useAccount();
    const [isOwnerAccount, setIsOwnerAccount] = useState(false);

    useEffect(() => {
        const checkOwner = async () => {
            if (address && address.connected) {
                console.log(address.provider);

                const provider = new ethers.BrowserProvider(address.provider);
                const contractWithSigner = getContractInstanceWithSigner(provider);
                const ownerStatus = await isOwner(contractWithSigner);
                setIsOwnerAccount(ownerStatus);
            }
        }
        checkOwner();
    }, [address]);

    return (
        <Box bg="teal.500" px={4} color="white" width="100%">
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Flex>
                    <Text fontSize="lg" fontWeight="bold">RoDec</Text>
                    <Stack direction={'row'} spacing={4} marginLeft={4}>
                        <NextLink href="/actions">
                            <Link fontWeight="bold" fontSize="lg">Nos actions</Link>
                        </NextLink>
                        <NextLink href="/donate">
                            <Link fontWeight="bold" fontSize="lg">Faire un don</Link>
                        </NextLink>
                        <NextLink href="/myProfile">
                            <Link fontWeight="bold" fontSize="lg">Mon compte</Link>
                        </NextLink>
                        {isOwnerAccount && (
                            <NextLink href="/admin">
                                <Link fontWeight="bold" fontSize="lg">Admin</Link>
                            </NextLink>
                        )}
                    </Stack>
                </Flex>
                <ConnectButton />
            </Flex>
        </Box>
    )
}

export default Navbar
