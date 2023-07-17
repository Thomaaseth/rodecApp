// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mint", function () {
    let Mint;
    let mint;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let marketplaceAddress;


    const baseURI = "https://test.com/";

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        let Mint = await ethers.getContractFactory("Mint");
        marketplaceAddress = await owner.getAddress();
        mint = await Mint.deploy(baseURI, marketplaceAddress);

    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await mint.owner()).to.equal(owner.address);
        });
    });

    describe("Minting a token", function () {
        it("Should mint a token", async function () {
            const initialTotalSupply = BigInt(await mint.totalSupply());
            const quantityToMint = 1n;
            const price = ethers.parseEther("0.03");

            await owner.sendTransaction({ to: addr1.address, value: price });
            await mint.connect(addr1).mint(quantityToMint, { value: price });

            const finalTotalSupply = BigInt(await mint.totalSupply());
            expect(finalTotalSupply - initialTotalSupply).to.equal(quantityToMint);
            const balanceOfAddr1 = BigInt(await mint.balanceOf(addr1.address));
            expect(balanceOfAddr1).to.equal(quantityToMint);
        });
    });

    it("Should mint 3 token", async function () {
        const initialTotalSupply = BigInt(await mint.totalSupply());
        const quantityToMint = 1n;
        const price = ethers.parseEther("0.09");

        await mint.connect(addr1).mint(quantityToMint, { value: price });
        const finalTotalSupply = BigInt(await mint.totalSupply());
        expect(finalTotalSupply - initialTotalSupply).to.equal(quantityToMint);
        const balanceOfAddr1 = BigInt(await mint.balanceOf(addr1.address));
        expect(balanceOfAddr1).to.equal(quantityToMint);
    });

    it("should not allow minting more than the maximum supply", async function () {
        const maxSupply = 20n;
        for (let i = 0; i < maxSupply; i++) {
            await mint.connect(addr1).mint(1);
        }
        await expect(mint.connect(addr2).mint(1)).to.be.revertedWith("Sold out");
        expect(BigInt(await mint.totalSupply())).to.equal(maxSupply);
    });

    it("should set the correct base URI", async function () {
        const newBaseURI = "https://new-test.com/";
        await mint.setBaseURI(newBaseURI);
        expect(await mint.baseURI()).to.equal(newBaseURI);
    });

    it("should allow the marketplace to transfer tokens after approval", async function () {
        await mint.connect(addr1).mint(1);
        expect(await mint.isApprovedForAll(addr1.address, marketplaceAddress)).to.equal(false);
        await mint.connect(addr1).approveMarketplace();
        expect(await mint.isApprovedForAll(addr1.address, marketplaceAddress)).to.equal(true);
    });

    it("should not allow non-owner to withdraw funds", async function () {
        const price = ethers.parseEther("0.03");
        const quantityToMint = 10n;

        for (let i = 0; i < quantityToMint; i++) {
            await mint.connect(addr1).mint(1, { value: price });
        }
        await expect(mint.connect(addr1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    // it("should not allow to mint more tokens than paid for", async function () {
    //     const priceForOneToken = ethers.parseEther("0.03");
    //     await expect(mint.connect(addr1).mint(2, { value: priceForOneToken })).to.be.revertedWith("Not enough ETH in wallet");
    // });

    it("should return correct tokenURI", async function () {
        const quantityToMint = 1n;
        const price = ethers.parseEther("0.03");

        await mint.connect(addr1).mint(quantityToMint, { value: price });

        const tokenURI = await mint.tokenURI(1);
        expect(tokenURI).to.equal("https://test.com/1.json");
    });

    it("should assign unique URIs to each token", async function () {
        const quantityToMint = 2n;
        const priceForTwoTokens = ethers.parseEther("0.06");

        await mint.connect(addr1).mint(quantityToMint, { value: priceForTwoTokens });

        const tokenURI1 = await mint.tokenURI(1);
        const tokenURI2 = await mint.tokenURI(2);

        expect(tokenURI1).to.not.equal(tokenURI2);
    });

    it("should emit the NFTMinted event upon successful minting", async function () {
        const quantityToMint = 1n;
        const price = ethers.parseEther("0.03");

        await expect(mint.connect(addr1).mint(quantityToMint, { value: price }))
            .to.emit(mint, 'NFTMinted')
            .withArgs(1);
    });





});
