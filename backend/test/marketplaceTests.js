const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("Marketplace", function () {
    let Donate, donate;
    let Marketplace, marketplace;
    let owner, addr1, addr2;

    beforeEach(async function () {
        let Donate = await ethers.getContractFactory("Donate");
        donate = await Donate.deploy();

        let Marketplace = await ethers.getContractFactory("Marketplace");
        marketplace = await Marketplace.deploy();

        [owner, addr1, addr2, _] = await ethers.getSigners();

    });

    it("Test Marketplace operations", async function () {
        async function logNftLists(marketplace, accountAddress) {
            let listedNfts = await marketplace.getListedNfts();
            let myNfts = await marketplace.getMyNfts({ from: accountAddress });
            let myListedNfts = await marketplace.getMyListedNfts({ from: accountAddress });
            console.log(`listedNfts: ${listedNfts.length}`);
            console.log(`myNfts: ${myNfts.length}`);
            console.log(`myListedNfts ${myListedNfts.length}\n`);
        }

        console.log('MINT AND LIST 3 NFTs');
        let listingFee = await marketplace.listFee();

        // Mint and List NFT 1
        await donate.mint(owner.address, 1);
        await donate.connect(owner).approve(marketplace.address, 1);
        await marketplace.connect(owner).listNft(donate.address, 1, ethers.utils.parseEther("1"), { value: listingFee });
        console.log(`Minted and listed 1`);

        // Mint and List NFT 2
        await donate.mint(owner.address, 2);
        await donate.connect(owner).approve(marketplace.address, 2);
        await marketplace.connect(owner).listNft(donate.address, 2, ethers.utils.parseEther("1"), { value: listingFee });
        console.log(`Minted and listed 2`);

        // Mint and List NFT 3
        await donate.mint(owner.address, 3);
        await donate.connect(owner).approve(marketplace.address, 3);
        await marketplace.connect(owner).listNft(donate.address, 3, ethers.utils.parseEther("1"), { value: listingFee });
        console.log(`Minted and listed 3`);

        await logNftLists(marketplace, owner.address);

        console.log('BUY 2 NFTs');
        await marketplace.connect(addr1).buyNft(donate.address, 1, { value: ethers.utils.parseEther("1") });
        await marketplace.connect(addr1).buyNft(donate.address, 2, { value: ethers.utils.parseEther("1") });
        await logNftLists(marketplace, addr1.address);

        console.log('RESELL 1 NFT');
        await donate.connect(addr1).approve(marketplace.address, 2);
        await marketplace.connect(addr1).sellNft(donate.address, 2, ethers.utils.parseEther("1"), { value: listingFee });
        await logNftLists(marketplace, addr1.address);
    });
});
