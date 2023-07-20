"use client"

import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Box, Button, Text, Alert, AlertIcon, Input } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import {
    getContractInstanceWithSigner,
    withdrawFunds,
    checkOwner,
    getBalance,
    changeMinDonationLimit,
} from '../contracts/donateContract';

function AdminPage() {
    const { account } = useAccount();
    const [isAdmin, setIsAdmin] = useState(false);
    const [contractBalance, setContractBalance] = useState('0');
    const [newMinDonationLimit, setNewMinDonationLimit] = useState('');

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (account.connected) {
                const provider = new ethers.BrowserProvider(account.provider);
                const contractWithSigner = getContractInstanceWithSigner(provider);

                const adminStatus = await checkOwner(contractWithSigner, account.address);
                setIsAdmin(adminStatus);

                if (adminStatus) {
                    const balance = await getBalance(contractWithSigner);
                    setContractBalance(ethers.formatEther(balance));
                }
            }
        };

        checkAdminStatus();
    }, [account]);

    const handleWithdraw = async () => {
        if (isAdmin) {
            const provider = new ethers.BrowserProvider(account.provider);
            const contractWithSigner = getContractInstanceWithSigner(provider);

            try {
                const tx = await withdrawFunds(contractWithSigner);
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
            const provider = new ethers.BrowserProvider(account.provider);
            const contractWithSigner = getContractInstanceWithSigner(provider);
            await changeMinDonationLimit(contractWithSigner, newMinDonationLimit);
        }
    };

    return (
        <Box p={4}>
            <Text fontSize="xl">Admin Page</Text>
            {!account.connected && (
                <Alert status="warning" mt={4}>
                    <AlertIcon />
                    Please connect your Wallet.
                </Alert>
            )}
            {!isAdmin && (
                <Alert status="warning" mt={4}>
                    <AlertIcon />
                    Only the contract owner can interact with this page.
                </Alert>
            )}
            <Text fontSize="md">Contract Balance: {contractBalance} ETH</Text>
            <Button mt={4} onClick={handleWithdraw} disabled={!account.connected || !isAdmin}>
                Withdraw Funds
            </Button>
            <Box mt={4}>
                <Text fontSize="md">Changer le minimum de donation en ETH</Text>

                <Input
                    value={newMinDonationLimit}
                    onChange={(e) => setNewMinDonationLimit(e.target.value)}
                    placeholder="Enter new minimum donation limit"
                    mb={2}
                />
                <Button onClick={handleChangeMinDonation} disabled={!account.connected || !isAdmin}>
                    Change Min Donation Limit
                </Button>
            </Box>
        </Box>
    );
}

export default AdminPage;
