require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers")
require('hardhat-deploy');
require('dotenv').config();

const { API_URL, MNEMONIC } = process.env;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    sepolia: {
      url: API_URL,
      accounts: {
        mnemonic: MNEMONIC
      },
      chainId: 11155111
    }
  },
  solidity: "0.8.20",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
