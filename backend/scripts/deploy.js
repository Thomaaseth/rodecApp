// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');

async function main() {

  const donate = await hre.ethers.deployContract("Donate");
  // const donate = await Donate.deploy();
  await donate.waitForDeployment();

  // await donate.deployed();

  // const donateData = {
  //   address: donate.address,
  //   abi: JSON.parse(donate.interface.format('json')),
  // };

  // fs.writeFileSync('donateData.json', JSON.stringify(donateData));

  console.log(
    `Donate deployed to ${donate.target}`
  );

  // const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  // const marketplace = await Marketplace.deploy();

  // await marketplace.deployed();

  // console.log(
  //   `Donate deployed to ${Marketplace.address}`
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
