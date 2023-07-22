"use client"

import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Box, Button, Text, Alert, AlertIcon, Input } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import {
    getContractInstanceWithSigner,
    withdraw,
    isOwner,
    getBalance,
    setPrice
} from '../contracts/donateContract';

function AdminPage() {
    console.log('Rendering admin page');


    const [isAdmin, setIsAdmin] = useState(false);
    const [contractBalance, setContractBalance] = useState('0');
    const [newMinDonationLimit, setNewMinDonationLimit] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { address, isConnected } = useAccount();

    useEffect(() => {
        const checkAdminStatus = async () => {
            setIsLoading(true);
            try {
                if (isConnected && address) {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const contractWithSigner = getContractInstanceWithSigner(provider, signer);

                    const adminStatus = await isOwner(contractWithSigner, address);
                    setIsAdmin(adminStatus);
                    if (adminStatus) {
                        const balance = await getBalance(contractWithSigner);
                        setContractBalance(ethers.formatEther(balance));
                    }
                }
            } catch (error) {
                console.error("Error while checking admin status:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminStatus();
    }, [isConnected, address]);



    const handleWithdraw = async () => {
        if (isAdmin) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contractWithSigner = getContractInstanceWithSigner(provider, signer);

            try {
                const tx = await withdraw(contractWithSigner);
                const balance = await getBalance(contractWithSigner);
                setContractBalance(ethers.formatEther(balance));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleChangeMinDonation = async () => {
        if (isAdmin) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractWithSigner = getContractInstanceWithSigner(provider, signer);
            await setPrice(contractWithSigner, newMinDonationLimit);
        }
    };

    return (
        <Box p={4}>
            <Text fontSize="xl">Admin Page</Text>
            {isLoading ? (
                <Alert status="info" mt={4}>
                    <AlertIcon />
                    Loading...
                </Alert>
            ) : (
                <>
                    {!isConnected ? (
                        <Alert status="warning" mt={4}>
                            <AlertIcon />
                            Connectez vous au bon network.
                        </Alert>
                    ) : null}
                    {!isAdmin ? (
                        <Alert status="warning" mt={4}>
                            <AlertIcon />
                            Seul l'owner du contract peut interagir avec cette Page.
                        </Alert>
                    ) : null}
                    <Text fontSize="md">Contract Balance: {console.log('Rendering contractBalance:', contractBalance)} {contractBalance} ETH</Text>
                    <Button mt={4} onClick={handleWithdraw} disabled={!isConnected || !isAdmin}>
                        Retirer les fonds
                    </Button>
                    <Box mt={4}>
                        <Text fontSize="md">Changer le minimum de donation en ETH</Text>
                        <Input
                            value={newMinDonationLimit}
                            onChange={(e) => setNewMinDonationLimit(e.target.value)}
                            placeholder="Entrez nouveau minimum de donation"
                            mb={2}
                        />
                        <Button onClick={handleChangeMinDonation} disabled={!isConnected || !isAdmin}>
                            Valider
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}

export default AdminPage;
