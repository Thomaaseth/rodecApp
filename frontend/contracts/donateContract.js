"use client"

import { ethers } from 'ethers';
import donateData from './donate.json';


export const contractABI = donateData.contracts.Donate.abi;
export const contractAddress = donateData.contracts.Donate.address;

export function getContractInstance(ethersProvider) {
    return new ethers.Contract(contractAddress, contractABI, ethersProvider);
}

export function getContractInstanceWithSigner(ethersProvider, signer) {
    return new ethers.Contract(contractAddress, contractABI, ethersProvider).connect(signer);
}

export async function isOwner(contractInstance, accountAddress) {
    const ownerAddress = await contractInstance.owner();
    return ethers.getAddress(accountAddress) === ethers.getAddress(ownerAddress);
}

export async function listenForNewDonations(donateContract) {
    donateContract.on('NewDonation', (sender, donationId, amount, timestamp, event) => {
        console.log(`New donation received from ${sender} with ID ${donationId}`);
        console.log(`Amount: ${ethers.formatEther(amount)} ETH at timestamp ${timestamp}`);
        console.log(`Transaction Hash: ${event.transactionHash}`);
        console.log(`Block Number: ${event.blockNumber}`);
    });
}

export async function getBalance(donateContract) {
    try {
        const balance = await donateContract.balance();
        return balance;
    } catch (err) {
        console.log('Error in getBalance function:', err);
        throw err;
    }
}


export async function makeDonation(donateContractWithSigner, amount) {
    try {
        const tx = await donateContractWithSigner.donate({ value: ethers.parseEther(amount) });
        const receipt = await tx.wait();
        console.log('Transaction receipt: ', receipt);
        return receipt;
    } catch (err) {
        console.log('Error in donate function: ', err);
        throw err;
    }
}

export async function getPrice(donateContract) {
    try {
        const price = await donateContract.getPrice();
        return ethers.formatEther(price);
    } catch (err) {
        console.log('Error in getPrice function:', err);
    }
}

export async function setPrice(donateContractWithSigner, newPrice) {
    try {
        const tx = await donateContractWithSigner.setPrice(ethers.parseEther(newPrice));
        const receipt = await tx.wait();
        console.log('Transaction:', receipt);
        return receipt;
    } catch (err) {
        console.log('Error is setPrice function:', err);
        throw err;
    }
}

export async function getDonationsTotal(donateContract) {
    try {
        const total = await donateContract.nbDonationsTotal();
        return total;
    } catch (err) {
        console.log('Error in nbDonationsTotal call', err);
    }
}

export async function getDonationDetails(donateContract, donationId) {
    try {
        const donateInfo = await donateContract.getDonationDetails(donationId);
        return donateInfo;
    } catch (err) {
        console.log('Error in getting donation info', err);
    }
}

export async function getDonationsOwner(donateContract, ownerAddress) {
    try {
        const donationsInfo = await donateContract.walletOfOwner(ownerAddress);
        return donationsInfo;
    } catch (err) {
        console.log('Error in retrieve donations for a wallet', err);
    }
}

export async function withdraw(donateContractWithSigner) {
    try {
        const tx = await donateContractWithSigner.withdraw();
        const receipt = await tx.wait();
        console.log('Transaction receipt:', receipt);
        return receipt;
    } catch (err) {
        console.log('Error in transaction receipt:', err);
        throw err;
    }
}
