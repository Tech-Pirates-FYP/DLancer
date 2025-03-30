require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey";
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2 || "0xkey";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";

module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337 
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    coinex: {
      url: "https://testnet-rpc.coinex.net",
      accounts: [PRIVATE_KEY],
      chainId: 53
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [PRIVATE_KEY_2],
      chainId: 84532
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};