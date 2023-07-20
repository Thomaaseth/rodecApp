"use client"
import { Box, Link, Flex, Text, Stack } from '@chakra-ui/react';
import NextLink from 'next/link'  // Rename to avoid name clash with Chakra UI's Link component
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { getContractInstanceWithSigner, isOwner } from '@/contracts/donateContract';
import { useEffect } from 'react';

const Navbar = () => {

    const { account } = useAccount();
    const [isOwnerAccount, setIsOwnerAccount] = useState(false);

    useEffect(() => {
        const checkOwner = async () => {
            if (account.connected) {
                const provider = new ethers.providers.Web3Provider(account.provider);
                const contractWithSigner = getContractInstanceWithSigner(provider);
                const ownerStatus = await isOwner(contractWithSigner);
                setIsOwnerAccount(ownerStatus);
            }
        }
        checkOwner();
    }, [account]);

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
                        <NextLink href="/marketplace">
                            <Link fontWeight="bold" fontSize="lg">Marketplace NFT</Link>
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
