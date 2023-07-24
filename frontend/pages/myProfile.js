"use client"

import { useState, useEffect } from 'react';
import { Box, Button, Input, SimpleGrid, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { ethers } from "ethers";
import { useAccount } from 'wagmi';
import { getDonationsOwner, getDonationDetails, getContractInstance, getContractInstanceWithSigner } from '../contracts/donateContract'

function MyProfilePage() {

    const [donations, setDonations] = useState([]);
    const [totalDonated, setTotalDonated] = useState(0);
    const [donationId, setDonationId] = useState('');
    const [selectedDonation, setSelectedDonation] = useState(null);
    const { address } = useAccount();
    const isConnected = address && ethers.isAddress(address);


    const fetchDonations = async () => {

        if (isConnected) {

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractInstance = getContractInstanceWithSigner(provider, signer);
            const donationIds = await getDonationsOwner(contractInstance, address);

            let userDonations = [];
            let total = 0n;

            for (let id of donationIds) {
                const donationDetails = await getDonationDetails(contractInstance, id.toString());
                if (donationDetails && donationDetails[0]) {
                    let donation = {
                        id: id.toString(),
                        amount: donationDetails[0],
                        timestamp: donationDetails[1]
                    };
                    userDonations.push(donation);

                    total += donation.amount;
                }
            }

            setDonations(userDonations);
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
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractInstance = getContractInstanceWithSigner(provider, signer);

            const owner = await contractInstance.ownerOf(newDonationId);
            if (owner !== address) {
                alert('Not your donation');
                return;
            }
            const donationDetails = await getDonationDetails(contractInstance, newDonationId);

            if (donationDetails && donationDetails[0]) {
                setSelectedDonation({
                    amount: donationDetails[0],
                    timestamp: donationDetails[1]
                });
            } else {
                setSelectedDonation(null);
            }
        } else {
            setSelectedDonation(null);
        }
    }

    useEffect(() => {
        if (isConnected) {
            fetchDonations();
        }
    }, [isConnected, address]);


    return (
        <Box p={4}>
            <Text fontSize="xl">Mes Donations</Text>
            {!isConnected && (
                <Alert status="warning" mt={4}>
                    <AlertIcon />
                    Connectez vous au bon network.
                </Alert>
            )}
            <Input
                value={donationId}
                onChange={handleDonationIdChange}
                placeholder="Entrez l'ID de votre donation pour obtenir des informations."
                mb={4}
            />
            {
                selectedDonation && (
                    <>
                        <Text>Amount: {ethers.formatEther(selectedDonation.amount.toString())} ETH</Text>
                        <Text>Timestamp: {new Date(Number(selectedDonation.timestamp.toString()) * 1000).toLocaleString()}</Text>
                    </>
                )
            }
            <Text>Somme totale de mes donations: {totalDonated} ETH</Text>
            <SimpleGrid columns={3} spacing={10}>
                {donations.map((donation, index) => (
                    <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden">
                        <Box p="6">
                            <Box d="flex" alignItems="baseline">
                                <Box fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                    Donation ID: {donation.id}
                                </Box>
                            </Box>
                            <Box>
                                Amount: {ethers.formatEther(donation.amount.toString())} ETH
                                <Box as="span" color="gray.600" fontSize="sm">
                                    Timestamp: {new Date(Number(donation.timestamp.toString()) * 1000).toLocaleString()}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid >
        </Box >
    );
}

export default MyProfilePage;
