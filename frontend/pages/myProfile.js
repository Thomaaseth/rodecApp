import { useState, useEffect } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { getDonationsOwner, getDonationDetails, getContractInstance } from '../contracts/donateContract'
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'

function MyProfilePage() {
    const [donations, setDonations] = useState([]);
    const [totalDonated, setTotalDonated] = useState(0);
    const [donationId, setDonationId] = useState(null);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const { account } = useAccount();

    const fetchDonations = async () => {
        if (account.connected) {
            const provider = new ethers.providers.Web3Provider(account.provider);
            const contractInstance = getContractInstance(provider);
            const userDonations = await getDonationsOwner(contractInstance, account.address);
            setDonations(userDonations);

            let total = 0n;
            for (let donation of userDonations) {
                total += BigInt(donation.amount);
            }
            setTotalDonated(ethers.formatEther(total.toString()));
        }
    }


    const handleDonationIdChange = async (e) => {
        const newDonationId = e.target.value;
        setDonationId(newDonationId);

        if (newDonationId !== '') {
            const provider = new ethers.providers.Web3Provider(account.provider);
            const contractInstance = getContractInstance(provider);
            const donationDetails = await getDonationDetails(contractInstance, newDonationId);
            setSelectedDonation(donationDetails);
        } else {
            setSelectedDonation(null);
        }
    }

    useEffect(() => {
        fetchDonations();
    }, [account.connected]);

    return (
        <Box p={4}>
            <Text fontSize="xl">My Donations</Text>
            {!account.connected && (
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
                placeholder="Enter donation ID to view related informations."
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
