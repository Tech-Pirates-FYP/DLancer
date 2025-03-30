const { ethers } = require("hardhat");

async function main () {
    const mockUSDC = await ethers.getContractFactory("mockUSDC");
    console.log('Deploying mockUSDC contract...');
    const mockUSDCContract = await mockUSDC.deploy();
    const mockUSDCContractAddress = await mockUSDCContract.getAddress();
    console.log('mockUSDC contract deployed to:', mockUSDCContractAddress);

    // const governanceToken = await ethers.getContractFactory("GovernanceToken");
    // console.log('Deploying governanceToken contract...');
    // const governanceTokenContract = await governanceToken.deploy();
    // const governanceTokenContractAddress = await governanceTokenContract.getAddress();
    // console.log('governanceToken contract deployed to:', governanceTokenContractAddress);

    const EscrowFactory = await ethers.getContractFactory("EscrowFactory");
    console.log('Deploying EscrowFactory ...');
    const escrowFactory = await EscrowFactory.deploy(mockUSDCContractAddress);
    const escrowFactoryAddress = await escrowFactory.getAddress();
    console.log('EscrowFactory deployed to:', escrowFactoryAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });