"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import OzcarTokenABI from "../src/contracts/abis/OzcarToken.json";
import VehicleNFTABI from "../src/contracts/abis/VehicleNFT.json";
import OzcarEscrowABI from "../src/contracts/abis/OzcarEscrow.json";
import OzcarReputationABI from "../src/contracts/abis/OzcarReputation.json";
import addresses from "../src/contracts/contract-addresses.json";

interface TechStats {
    consistencyScore: number;
    participationScore: number;
    juryScore: number;
    tokenStake: string;
    totalReputation: number;
}

interface Web3ContextType {
    account: string | null;
    balance: string;
    reputation: number;
    techStats: TechStats | null;
    provider: BrowserProvider | null;
    connectWallet: () => Promise<void>;
    ozcarToken: Contract | null;
    vehicleNFT: Contract | null;
    ozcarEscrow: Contract | null;
    ozcarReputation: Contract | null;
    refreshData: () => Promise<void>;
    getVehicleDetails: (tokenId: string) => Promise<any>;
    stakeOZC: (amount: string) => Promise<void>;
    unstakeOZC: (amount: string) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
    account: null,
    balance: "0",
    reputation: 0,
    techStats: null,
    provider: null,
    connectWallet: async () => { },
    ozcarToken: null,
    vehicleNFT: null,
    ozcarEscrow: null,
    ozcarReputation: null,
    refreshData: async () => { },
    getVehicleDetails: async () => null,
    stakeOZC: async () => { },
    unstakeOZC: async () => { },
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState<string>("0");
    const [reputation, setReputation] = useState<number>(0);
    const [techStats, setTechStats] = useState<TechStats | null>(null);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [ozcarToken, setOzcarToken] = useState<Contract | null>(null);
    const [vehicleNFT, setVehicleNFT] = useState<Contract | null>(null);
    const [ozcarEscrow, setOzcarEscrow] = useState<Contract | null>(null);
    const [ozcarReputation, setOzcarReputation] = useState<Contract | null>(null);

    const isConnecting = React.useRef(false);

    const initContracts = async (signer: any, address: string) => {
        try {
            const token = new ethers.Contract(addresses.OzcarToken, OzcarTokenABI.abi, signer);
            const nft = new ethers.Contract(addresses.VehicleNFT, VehicleNFTABI.abi, signer);
            const escrow = new ethers.Contract(addresses.OzcarEscrow, OzcarEscrowABI.abi, signer);
            const rep = new ethers.Contract(addresses.OzcarReputation, OzcarReputationABI.abi, signer);

            setOzcarToken(token);
            setVehicleNFT(nft);
            setOzcarEscrow(escrow);
            setOzcarReputation(rep);

            // Verify code exists at address before calling
            const code = await signer.provider.getCode(addresses.OzcarToken);
            if (code === "0x") {
                console.error("No contract found at OzcarToken address. Network mismatch?");
                return;
            }

            // Fetch Balance & Detailed Reputation
            const [bal, stats] = await Promise.all([
                token.balanceOf(address),
                rep.technicians(address)
            ]);

            setBalance(ethers.formatEther(bal));
            setReputation(Number(stats.totalReputation));
            setTechStats({
                consistencyScore: Number(stats.consistencyScore),
                participationScore: Number(stats.participationScore),
                juryScore: Number(stats.juryScore),
                tokenStake: ethers.formatEther(stats.tokenStake),
                totalReputation: Number(stats.totalReputation)
            });
        } catch (err) {
            console.error("Failed to initialize contracts", err);
        }
    };

    const refreshData = async () => {
        if (!account || !ozcarToken || !ozcarReputation) return;
        try {
            const [bal, stats] = await Promise.all([
                ozcarToken.balanceOf(account),
                ozcarReputation.technicians(account)
            ]);
            setBalance(ethers.formatEther(bal));
            setReputation(Number(stats.totalReputation));
            setTechStats({
                consistencyScore: Number(stats.consistencyScore),
                participationScore: Number(stats.participationScore),
                juryScore: Number(stats.juryScore),
                tokenStake: ethers.formatEther(stats.tokenStake),
                totalReputation: Number(stats.totalReputation)
            });
        } catch (err) {
            console.error("Data refresh failed", err);
        }
    };

    const stakeOZC = async (amount: string) => {
        if (!ozcarToken || !ozcarReputation || !account) return;
        try {
            const wei = ethers.parseEther(amount);
            // 1. Approve
            const txApprove = await ozcarToken.approve(addresses.OzcarReputation, wei);
            await txApprove.wait();
            // 2. Stake
            const txStake = await ozcarReputation.stake(wei);
            await txStake.wait();
            await refreshData();
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    const unstakeOZC = async (amount: string) => {
        if (!ozcarReputation || !account) return;
        try {
            const wei = ethers.parseEther(amount);
            const tx = await ozcarReputation.unstake(wei);
            await tx.wait();
            await refreshData();
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    const connectWallet = async () => {
        if (isConnecting.current) return;
        if (typeof window.ethereum !== "undefined") {
            try {
                isConnecting.current = true;
                const _provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await _provider.send("eth_requestAccounts", []);
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setProvider(_provider);
                    const signer = await _provider.getSigner();
                    await initContracts(signer, accounts[0]);
                }
            } catch (error: unknown) {
                const err = error as any;
                if (err.code === 4001) {
                    console.log("User rejected connection");
                } else {
                    console.error("Connection failed", err);
                }
            } finally {
                isConnecting.current = false;
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    useEffect(() => {
        if (typeof window.ethereum === "undefined") return;

        const _provider = new ethers.BrowserProvider(window.ethereum);

        // Use eth_accounts to check if we're already authorized WITHOUT triggering a popup
        _provider.send("eth_accounts", []).then(async (accounts: string[]) => {
            if (accounts.length > 0 && !isConnecting.current) {
                setAccount(accounts[0]);
                setProvider(_provider);
                const signer = await _provider.getSigner();
                await initContracts(signer, accounts[0]);
            }
        });

        const handleAccountsChanged = async (accounts: string[]) => {
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                const signer = await _provider.getSigner();
                await initContracts(signer, accounts[0]);
            } else {
                setAccount(null);
                setOzcarToken(null);
                setVehicleNFT(null);
                setOzcarEscrow(null);
                setBalance("0");
                setReputation(0);
                setTechStats(null);
            }
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        };
    }, []);

    const getVehicleDetails = async (tokenId: string) => {
        // Helper to fetch IPFS data or contract data
        // For now just return null
        return null;
    };

    return (
        <Web3Context.Provider
            value={{
                account,
                balance,
                reputation,
                techStats,
                provider,
                connectWallet,
                ozcarToken,
                vehicleNFT,
                ozcarEscrow,
                ozcarReputation,
                refreshData,
                getVehicleDetails,
                stakeOZC,
                unstakeOZC
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};
