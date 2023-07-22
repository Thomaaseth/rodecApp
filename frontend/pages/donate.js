"use client"

import { useState, useEffect } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { ethers } from "ethers";
import { useAccount } from 'wagmi';
import { makeDonation, getContractInstanceWithSigner } from '../contracts/donateContract'
import { Alert, AlertIcon } from '@chakra-ui/react'

function DonatePage() {
    const [donationAmount, setDonationAmount] = useState('');
    const [transactionStatus, setTransactionStatus] = useState(null);
    const { address } = useAccount();
    const isConnected = address && ethers.isAddress(address);

    const handleDonate = async () => {
        if (isConnected) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contractWithSigner = getContractInstanceWithSigner(provider, signer);
            try {
                setTransactionStatus('Pending...');
                const tx = await makeDonation(contractWithSigner, donationAmount);
                setTransactionStatus('Success');
                setDonationAmount('');
            } catch (err) {
                console.error("Erreur:", err.message);
                setTransactionStatus('Transaction failed. Please try again');
            }
        }
    };

    return (
        <Box p={4}>
            <Text fontSize="xl">Faire une donation</Text>
            {!isConnected && (
                <Alert status="warning" mt={4}>
                    <AlertIcon />
                    Connectez vous au bon network.
                </Alert>
            )}
            <Input
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Entrez montant donation"
                mb={4}
            />
            <Button onClick={handleDonate} disabled={!isConnected}>Donner</Button>
            {transactionStatus && (
                <Text mt={4}>{transactionStatus}</Text>
            )}
        </Box>
    );
}

export default DonatePage;
