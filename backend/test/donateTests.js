const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { isCallTrace } = require('hardhat/internal/hardhat-network/stack-traces/message-trace');


describe("Donate unit tests", function () {
  let Donate, donate, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    let Donate = await ethers.getContractFactory("Donate");
    donate = await Donate.deploy();
    // await donate.deployed();
  });

  /// Deployment test

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await donate.owner()).to.equal(owner.address);
    });
  });

  /// Test donation features 

  describe("Transactions", function () {
    it("Should not allow non-owners to change the price", async function () {
      await expect(donate.connect(addr1).setPrice(100)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owners to change the price", async function () {
      await donate.setPrice(100);
      expect(await donate.getPrice()).to.equal(100);
    });

    it("Should not allow donations below the set price", async function () {
      await donate.setPrice(100);
      await expect(donate.connect(addr1).donate({ value: 50 })).to.be.revertedWith("Amount too low");
    });

    it("Should allow donations above or equal to the set price", async function () {
      await donate.setPrice(100);
      await donate.connect(addr1).donate({ value: 100 });
      expect(await donate.balanceOf(addr1.address)).to.equal(1);
    });

    it("Should increment the donationId with each donation", async function () {
      await donate.setPrice(100);
      await donate.connect(addr1).donate({ value: 100 });
      await donate.connect(addr2).donate({ value: 100 });
      expect(await donate.nbDonationsTotal()).to.equal(2);
    });

    it('Should correctly store donation details', async function () {
      await donate.setPrice(100);
      const tx = await donate.connect(addr1).donate({ value: ethers.parseEther('1') });
      const receipt = await tx.wait();
      const donationId = receipt.events[0].args[1].toNumber();
      const [donationAmount, donationTime] = await donate.getDonationDetails(donationId);

      expect(donationAmount).to.equal(ethers.parseEther('1'));
      expect(donationTime).to.be.at.least(startTime);
    });




    it("Should not allow token transfers", async function () {
      await donate.setPrice(100);
      await donate.connect(addr1).donate({ value: 100 });
      await expect(donate.connect(addr1).transferFrom(addr1.address, addr2.address, 0)).to.be.revertedWith("Transfer not allowed");
    });

    it("Should allow the owner to withdraw", async function () {
      await donate.setPrice(100);
      await donate.connect(addr1).donate({ value: 100 });
      await donate.withdraw();
      // You might need to add a check here, depending on the exact behavior of your withdrawal function
    });

    it("Should not allow non-owners to withdraw", async function () {
      await donate.setPrice(100);
      await donate.connect(addr1).donate({ value: 100 });
      await expect(donate.connect(addr1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
