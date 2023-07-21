"use client"

import { useState, useEffect } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { ethers } from "ethers";
import { useAccount } from 'wagmi';
import { getDonationsOwner, getDonationDetails, getContractInstance } from '../contracts/donateContract'
import { Alert, AlertIcon } from '@chakra-ui/react'

function MyProfilePage() {
    const [donations, setDonations] = useState([]);
    const [totalDonated, setTotalDonated] = useState(0);
    const [donationId, setDonationId] = useState('');
    const [selectedDonation, setSelectedDonation] = useState(null);
    const { address } = useAccount();
    console.log('MyProfilePage - address:', address);


    const fetchDonations = async () => {
        if (address && address.connected) {
            const provider = new ethers.BrowserProvider(address.provider);
            const contractInstance = getContractInstance(provider);
            const userDonations = await getDonationsOwner(contractInstance, address.address);
            setDonations(userDonations);

            let total = 0n;
            for (let donation of userDonations) {
                total += BigInt(donation.amount);
            }
            setTotalDonated(ethers.formatEther(total.toString()));
        } else {
            setDonations([]);
            setTotalDonated(0);
        }
    }


    const handleDonationIdChange = async (e) => {
        const newDonationId = e.target.value;
        setDonationId(newDonationId);

        if (newDonationId !== '') {
            const provider = new ethers.BrowserProvider(address.provider);
            const contractInstance = getContractInstance(provider);
            const donationDetails = await getDonationDetails(contractInstance, newDonationId);
            setSelectedDonation(donationDetails);
        } else {
            setSelectedDonation(null);
        }
    }

    useEffect(() => {
        if (address && address.connected) {
            console.log("MyProfilePage - address:", address);
            fetchDonations();
        }
    }, [address?.connected, address]);


    return (
        <Box p={4}>
            <Text fontSize="xl">My Donations</Text>
            {address && !address.connected && (
                <Alert status="warning" mt={4}>
                    <AlertIcon />
                    Please connect your Wallet.
                </Alert>
            )}
            <Text>Total donated: {totalDonated} ETH</Text>
            {donations.map((donation, index) => (
                <Box key={index}>
                    <Text>Donation ID: {donation.id}</Text>
                    <Text>Timestamp: {donation.timestamp}</Text>
                </Box>
            ))}
            <Input
                value={donationId}
                onChange={handleDonationIdChange}
                placeholder="Entrez l'ID de votre donation pour obtenir des informations."
                mb={4}
            />
            {selectedDonation && (
                <>
                    <Text>Amount: {ethers.formatEther(selectedDonation.amount.toString())} ETH</Text>
                    <Text>Timestamp: {selectedDonation.timestamp}</Text>
                </>
            )}
        </Box>
    );
}

export default MyProfilePage;
