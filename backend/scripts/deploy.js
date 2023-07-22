
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const donate = await hre.ethers.deployContract("Donate");
  console.log("Donate contract address:", await donate.getAddress());

  await donate.waitForDeployment();


  const donateData = {
    address: await donate.getAddress(),
    abi: donate.interface.format('json'),
  };

  const filePath = path.join(__dirname, "../../frontend/contracts/donate.json");
  fs.writeFileSync(filePath, JSON.stringify(donateData));

  console.log("Contract data written to:", filePath);

  console.log(
    `Donate deployed to ${donate.target}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = (1);
  });
