const { ethers } = require("hardhat")

async function main() {

    const [owner] = await ethers.getSigners()

    const donateContract = await ethers.getContractAt("Donate", "0x678e7bd7111088254795017461567335092d4D1e");

    console.log("Making a donation...")
    let transaction = await donateContract.connect(owner).donate({ value: ethers.parseEther("0.01") })
    await transaction.wait()

    console.log("Withdrawing funds...")
    transaction = await donateContract.connect(owner).withdraw();
    await transaction.wait()
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
