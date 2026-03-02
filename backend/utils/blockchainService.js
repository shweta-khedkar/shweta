const { ethers } = require('ethers');

// Mock ABI for ConsentLog
const consentLogAbi = [
    "function addLog(string memory _userId, string memory _action, string memory _detailsHash)",
    "event LogAdded(string indexed userId, string action, uint256 timestamp)"
];

const contractAddress = process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000"; // Mock Address

// Provider setup (e.g., Infura/Alchemy for Sepolia, or Hardhat local)
const providerUrl = process.env.RPC_URL || "http://127.0.0.1:8545";

async function logToBlockchain(userId, action, detailsHash) {
    try {
        const provider = new ethers.JsonRpcProvider(providerUrl);
        // Note: For real deployments, configure a private key in .env
        const privateKey = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Default Hardhat Account #0

        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(contractAddress, consentLogAbi, wallet);

        console.log(`[Blockchain] Adding log for user: ${userId}, Action: ${action}`);

        // Uncomment below to actually send TX if a local node is running
        // const tx = await contract.addLog(userId, action, detailsHash);
        // await tx.wait();

        console.log(`[Blockchain] Log successfully submitted (Mock).`);
        return true;
    } catch (error) {
        console.error("[Blockchain] Error submitting log", error);
        return false;
    }
}

module.exports = { logToBlockchain };
