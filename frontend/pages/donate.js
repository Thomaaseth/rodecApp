"use client"

import { useState, useEffect } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { donate, getContractInstanceWithSigner } from '../contracts/donateContract'
import { Alert, AlertIcon } from '@chakra-ui/react'

function DonatePage() {
    const [donationAmount, setDonationAmount] = useState('');
    const [transactionStatus, setTransactionStatus] = useState(null);
    const { account } = useAccount();

    const handleDonate = async () => {
        if (account.connected) {
            const provider = new ethers.providers.Web3Provider(account.provider);
            const contractWithSigner = getContractInstanceWithSigner(provider);

            try {
                setTransactionStatus('Pending...');
                const tx = await donate(contractWithSigner, donationAmount);
                setTransactionStatus('Success');
                setDonationAmount('');
            } catch (err) {
                console.error(err);
                setTransactionStatus('Transaction failed. Please try again');
            }
        }
    };

    return (
        <Box p={4}>
            <Text fontSize="xl">Make a Donation</Text>
            {!account.connected && (
                <Alert status="warning" mt={4}>
                    <AlertIcon />
                    Please connect your Wallet.
                </Alert>
            )}
            <Input
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Enter donation amount in ETH"
                mb={4}
            />
            <Button onClick={handleDonate} disabled={!account.connected}>Donate</Button>
            {transactionStatus && (
                <Text mt={4}>{transactionStatus}</Text>
            )}
        </Box>
    );
}

export default DonatePage;
