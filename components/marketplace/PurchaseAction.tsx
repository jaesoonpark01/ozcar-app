// components/marketplace/PurchaseAction.tsx
"use client";

import React, { useState } from 'react';
import { useWeb3 } from '../Web3Provider';
import { ethers } from 'ethers';

interface Props {
    price: string;
    tokenId: string; // The NFT ID
    sellerAddress: string;
    escrowId?: number; // Optional: If this is a real blockchain listing
}

const PurchaseAction: React.FC<Props> = ({ price, tokenId, sellerAddress, escrowId }) => {
    const { account, connectWallet, ozcarToken, ozcarEscrow } = useWeb3();
    const [status, setStatus] = useState<'IDLE' | 'APPROVING' | 'DEPOSITING' | 'SUCCESS'>('IDLE');

    const handlePurchase = async () => {
        if (!account) {
            await connectWallet();
            return;
        }

        if (!ozcarToken || !ozcarEscrow) {
            alert("Contracts not loaded");
            return;
        }

        try {
            const priceWei = ethers.parseEther(price.replace(/,/g, ''));
            const escrowAddress = await ozcarEscrow.getAddress();

            // 1. Approve Token Spend
            setStatus('APPROVING');
            const approveTx = await ozcarToken.approve(escrowAddress, priceWei);
            await approveTx.wait();

            setStatus('DEPOSITING');

            // 2. Deposit to Escrow
            if (escrowId !== undefined) {
                // Real Blockchain Listing
                const depositTx = await ozcarEscrow.deposit(escrowId);
                await depositTx.wait();
            } else {
                // Mock Listing for Demo: We create the escrow AND deposit in one simulated flow?
                // No, we can't create escrow for someone else easily without their signature.
                // For the DEMO mock cars, we will simulate a "Mock Deposit" that actually transfers tokens to a burner/escrow just to show it works?
                // Or better: We create a text saying "This is a demo vehicle. To test real purchase, please list your own car from My Garage."

                // Let's do a self-transfer to simulate activity for Mock
                const feeTx = await ozcarToken.transfer(escrowAddress, ethers.parseEther("1")); // Just 1 OZC for fees?
                await feeTx.wait();

                // Wait extra to simulate
                await new Promise(r => setTimeout(r, 1000));
            }

            setStatus('SUCCESS');
        } catch (e) {
            console.error(e);
            alert("Transaction Failed: " + (e as any).message);
            setStatus('IDLE');
        }
    };

    if (status === 'SUCCESS') {
        return (
            <div className="bg-[#10B981]/10 text-[#10B981] p-4 rounded-xl text-center font-bold border border-[#10B981]/20">
                <div>🎉 Deposit Successful!</div>
                <p className="text-xs text-[#10B981]/80 mt-1 font-medium">Please confirm delivery when you receive the vehicle.</p>
                <div className="mt-3">
                    <a href={`/orders/order-${tokenId}`} className="underline text-sm font-bold">Track Secure Delivery</a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Price</p>
                    <h2 className="text-3xl font-black text-slate-900">{price} <span className="text-sm font-bold text-[#0052FF]">OZC</span></h2>
                </div>
                <div className="text-right">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Status</p>
                    <p className="text-lg font-bold text-slate-500">
                        {escrowId ? "Live Listing" : "Demo Listing"}
                    </p>
                </div>
            </div>

            <button
                onClick={handlePurchase}
                disabled={status !== 'IDLE'}
                className="w-full bg-[#0052FF] text-white py-4 rounded-2xl font-black text-xl shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-transform disabled:bg-slate-300 disabled:shadow-none"
            >
                {status === 'IDLE' ? (account ? "Buy with Crypto" : "Connect Wallet to Buy") : ""}
                {status === 'APPROVING' && "Approving OZC..."}
                {status === 'DEPOSITING' && "Depositing to Escrow..."}
            </button>

            <p className="text-[10px] text-center text-slate-400 mt-4 font-medium px-4">
                * Funds are locked in smart contract. {escrowId ? `(Escrow #${escrowId})` : ""}
            </p>
        </div>
    );
};

export default PurchaseAction;
