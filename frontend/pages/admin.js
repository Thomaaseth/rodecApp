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
    const [isAdmin, setIsAdmin] = useState(false);
    const [contractBalance, setContractBalance] = useState('0');
    const [newMinDonationLimit, setNewMinDonationLimit] = useState('');
    const { address } = useAccount();


    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                if (address && address.connected) {
                    const provider = new ethers.BrowserProvider(address.provider);
                    const contractWithSigner = getContractInstanceWithSigner(provider);

                    const adminStatus = await isOwner(contractWithSigner, address.address);
                    setIsAdmin(adminStatus);
                    if (adminStatus) {
                        const balance = await getBalance(contractWithSigner);
                        setContractBalance(ethers.formatEther(balance));
                    }
                }
            } catch (error) {
                console.error("Error while checking admin status:", error);
            }
        };

        checkAdminStatus();
    }, [address?.connected, address]);



    const handleWithdraw = async () => {
        if (isAdmin) {
            const provider = new ethers.BrowserProvider(address.provider);
            const contractWithSigner = getContractInstanceWithSigner(provider);

            try {
                const tx = await withdraw(contractWithSigner);
                console.log('Transaction successful. Hash:', tx.hash);
                const balance = await getBalance(contractWithSigner);
                setContractBalance(ethers.formatEther(balance));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleChangeMinDonation = async () => {
        if (isAdmin) {
            const provider = new ethers.BrowserProvider(address.provider);
            const contractWithSigner = getContractInstanceWithSigner(provider);
            await setPrice(contractWithSigner, newMinDonationLimit);
        }
    };

    return (
        <Box p={4}>
            <Text fontSize="xl">Admin Page</Text>
            {address && !address.connected ? (
                <Alert status="warning" mt={4}>
                    <AlertIcon />
                    Connectez vous au bon network.
                </Alert>
            ) : null}
            {!isAdmin ? (
                <Alert status="warning" mt={4}>
                    <AlertIcon />
                    Seul l'owner du contract peut interagir.
                </Alert>
            ) : null}
            <Text fontSize="md">Contract Balance: {contractBalance} ETH</Text>
            <Button mt={4} onClick={handleWithdraw} disabled={!address?.connected || !isAdmin}>
                Retirer les fonds.
            </Button>
            <Box mt={4}>
                <Text fontSize="md">Changer le minimum de donation en ETH</Text>
                <Input
                    value={newMinDonationLimit}
                    onChange={(e) => setNewMinDonationLimit(e.target.value)}
                    placeholder="Entrez nouveau minimum de donation"
                    mb={2}
                />
                <Button onClick={handleChangeMinDonation} disabled={!address?.connected || !isAdmin}>
                    Valider
                </Button>
            </Box>
        </Box>
    );
}

export default AdminPage;
