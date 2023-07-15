// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mint", function () {
    let mint;
    let owner;
    let addr1;
    let addr2;
    let marketplaceAddress;


    const baseURI = "https://test.com/";

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
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
            const initialTotalSupply = await mint.totalSupply();
            const quantityToMint = 1;
            const price = ethers.parseEther("0.03"); // Assuming the price is 0.03 ether

            // Transfer the required amount of Ether to addr1
            await owner.sendTransaction({ to: addr1.address, value: price });

            // Mint a token from addr1
            await mint.connect(addr1).mint(quantityToMint, { value: price });

            const finalTotalSupply = await mint.totalSupply();

            // Assert that the total supply has increased by the minted quantity
            expect(finalTotalSupply.sub(initialTotalSupply)).to.equal(ethers.BigNumber.from(quantityToMint));

            // Check that the token belongs to addr1 by checking the balance
            const balanceOfAddr1 = await mint.balanceOf(addr1.address);
            expect(ethers.BigNumber.from(balanceOfAddr1)).to.equal(ethers.BigNumber.from(quantityToMint));
        });
    });




    // it("should mint the correct quantity of tokens", async function () {
    //     const quantity = 1;
    //     const totalSupply = (await mint.totalSupply()).toString();
    //     console.log(totalSupply); // To check totalSupply

    //     const expectedTotalSupply = ethers.BigNumber.from(totalSupply).add(quantity);
    //     console.log('addr1:', addr1);

    //     await mint.connect(addr1).mint(quantity, { value: ethers.parseEther("0.03") });

    //     // Check the total supply after minting
    //     expect(await mint.totalSupply()).to.equal(expectedTotalSupply);

    //     // Verify the token URIs
    //     for (let tokenId = expectedTotalSupply.toNumber() - quantity + 1; tokenId <= expectedTotalSupply.toNumber(); tokenId++) {
    //         const expectedTokenURI = `${baseURI}${tokenId}.json`;
    //         expect(await mint.tokenURI(tokenId)).to.equal(expectedTokenURI);
    //     }
    // });

    // it("should not allow minting more than the maximum supply", async function () {
    //     const maxSupply = 1000;
    //     await mint.mint(maxSupply); // Minting all tokens to reach the maximum supply

    //     // Attempt to mint one more token
    //     await expect(mint.connect(addr1).mint(1)).to.be.revertedWith("Sold out");

    //     // Check the total supply remains at the maximum supply
    //     expect(await mint.totalSupply()).to.equal(maxSupply);
    // });

    it("should set the correct base URI", async function () {
        const newBaseURI = "https://new-test.com/";

        await mint.setBaseURI(newBaseURI);

        // Verify the updated base URI
        expect(await mint.baseURI()).to.equal(newBaseURI);
    });
});
