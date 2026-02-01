// services/miningService.ts
import { ethers } from 'ethers';
import addresses from '../src/contracts/contract-addresses.json';
import VehicleNFTABI from '../src/contracts/abis/VehicleNFT.json';

export const MiningService = {
    // IPFS Upload Simulation
    async uploadToIPFS(file: File): Promise<string> {
        console.log("Uploading file to IPFS...", file.name);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "QmXoyp...789MockCID" + Math.floor(Math.random() * 1000);
    },

    // Blockchain Mining (Real Integration)
    async recordMaintenance(payload: { vin: string, ipfsHash: string, mileage: string | number }) {
        if (typeof window.ethereum === "undefined") throw new Error("MetaMask not installed");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const nftContract = new ethers.Contract(addresses.VehicleNFT, VehicleNFTABI.abi, signer);

        // 1. Try to find the tokenId for this VIN
        const vinHash = ethers.id(payload.vin);
        const allRegEvents = await nftContract.queryFilter(nftContract.filters.VehicleRegistered(), 0, 'latest');
        const events = allRegEvents.filter((e: unknown) => {
            const event = e as { args: { vin: string } };
            return ethers.id(event.args.vin) === vinHash;
        });

        let tx;
        if (events.length > 0) {
            const event = events[0] as unknown as { args: { tokenId: string } };
            const tokenId = event.args.tokenId;
            // 2. Add maintenance record to existing NFT
            tx = await nftContract.addMaintenanceRecord(
                tokenId,
                payload.ipfsHash,
                payload.mileage,
                "Regular Maintenance",
                signer.address
            );
        } else {
            // 3. Register as new if not exists (Fall-back for demo)
            tx = await nftContract.registerVehicle(signer.address, payload.vin, `ipfs://${payload.ipfsHash}`);
        }

        const receipt = await tx.wait();
        return { success: true, txHash: receipt.hash };
    },

    // Claim rewards: Mints OZC + Updates Reputation
    async claimReward(technician: string) {
        if (typeof window.ethereum === "undefined") return;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const token = new ethers.Contract(addresses.OzcarToken, ["function mint(address to, uint256 amount) external"], signer);
        const rep = new ethers.Contract(addresses.OzcarReputation, ["function updateStats(address _tech, uint256 _d, uint256 _p, uint256 _j, uint256 _t) external", "function technicians(address) public view returns (uint256 consistencyScore, uint256 participationScore, uint256 juryScore, uint256 tokenStake, uint256 totalReputation, bool isBlacklisted)"], signer);

        // 1. Mint 15 OZC Reward
        const txMint = await token.mint(technician, ethers.parseEther("15"));
        await txMint.wait();

        // 2. Proactively update reputation points (Simulation of algorithm)
        const stats = await rep.technicians(technician);
        const txRep = await rep.updateStats(
            technician,
            Math.min(Number(stats.consistencyScore) + 5, 100), // Increase D
            Math.min(Number(stats.participationScore) + 2, 100), // Increase P
            Number(stats.juryScore),
            stats.tokenStake
        );
        await txRep.wait();

        return true;
    },

    // Fetch History from Blockchain Events
    async getVehicleHistory(vin: string) {
        if (typeof window.ethereum === "undefined") return [];
        const provider = new ethers.BrowserProvider(window.ethereum);
        const nftContract = new ethers.Contract(addresses.VehicleNFT, VehicleNFTABI.abi, provider);

        const vinHash = ethers.id(vin);
        const allRegEvents = await nftContract.queryFilter(nftContract.filters.VehicleRegistered(), 0, 'latest');
        const regEvents = allRegEvents.filter((e: unknown) => {
            const event = e as { args: { vin: string } };
            return ethers.id(event.args.vin) === vinHash;
        });

        if (regEvents.length === 0) return [];

        const regEvent = regEvents[0] as unknown as { args: { tokenId: string, owner: string }, transactionHash: string, blockNumber: number };
        const tokenId = regEvent.args.tokenId;
        const count = await nftContract.getMaintenanceHistoryCount(tokenId);
        const metadataUri = await nftContract.tokenURI(tokenId);

        const history = [];
        // Add Registration as first event
        history.push({
            type: "REGISTRATION",
            owner: regEvent.args.owner,
            vin: vin,
            tokenUri: metadataUri,
            txHash: regEvent.transactionHash,
            blockNumber: regEvent.blockNumber,
            timestamp: "Original Mint"
        });

        // Add Maintenance Records
        for (let i = 0; i < count; i++) {
            const record = await nftContract.getMaintenanceRecord(tokenId, i);
            history.push({
                type: "MAINTENANCE",
                technician: record.technician,
                mileage: record.mileage.toString(),
                description: record.description,
                tokenUri: record.ipfsHash,
                timestamp: new Date(Number(record.timestamp) * 1000).toLocaleString(),
                txHash: "Internal Record",
                blockNumber: "-"
            });
        }

        return history;
    }
};

