"use client";

import React, { useState, useEffect } from 'react';
import MarketplaceLayout from '../../components/layout/MarketplaceLayout';
import { useWeb3 } from '../../components/Web3Provider';
import { ethers } from 'ethers';
import { ShoppingBag, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface Sale {
    id: number;
    car: string;
    price: string;
    state: number;
    buyer: string;
}

const STATE_LABELS = ["Awaiting Deposit", "Awaiting Delivery", "Complete", "Dispute", "Refunded"];
const STATE_COLORS = [
    "bg-yellow-100 text-yellow-700",
    "bg-blue-100 text-[#0052FF]",
    "bg-green-100 text-green-700",
    "bg-red-100 text-red-700",
    "bg-slate-100 text-slate-700"
];

export default function MySalesPage() {
    const { ozcarEscrow, account } = useWeb3();
    const [sales, setSales] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMySales();
    }, [ozcarEscrow, account]);

    async function fetchMySales() {
        if (!ozcarEscrow || !account) {
            setIsLoading(false);
            return;
        }
        try {
            // Query EscrowCreated events for user as seller
            const filter = ozcarEscrow.filters.EscrowCreated(null, null, account, null, null);
            const events = await ozcarEscrow.queryFilter(filter, 0, 'latest');

            const mySales: Sale[] = [];
            for (const event of events) {
                const id = Number((event as any).args.escrowId);
                const escrowData = await ozcarEscrow.escrows(id);

                mySales.push({
                    id,
                    car: "Vehicle NFT #" + escrowData.tokenId,
                    price: ethers.formatEther(escrowData.price),
                    state: Number(escrowData.state),
                    buyer: escrowData.buyer
                });
            }
            setSales(mySales);
        } catch (error) {
            console.error("Failed to fetch sales", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <MarketplaceLayout>
            <div className="max-w-5xl mx-auto py-10">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">My Sales Dashboard</h1>
                        <p className="text-slate-500 font-medium">Manage your vehicle listings and track buyer deposits.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-slate-100 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : sales.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No active sales</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mb-8">List your vehicles in the marketplace to start seeing sale requests here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sales.map((sale) => (
                            <div key={sale.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#0052FF]/20 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">
                                            🚗
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-black text-slate-900">{sale.car}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATE_COLORS[sale.state]}`}>
                                                    {STATE_LABELS[sale.state]}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono">
                                                Buyer: {sale.buyer.substring(0, 6)}...{sale.buyer.substring(38)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Price</div>
                                            <div className="text-xl font-black text-[#0052FF]">{sale.price} OZC</div>
                                        </div>
                                        <button className="bg-slate-50 p-4 rounded-2xl group-hover:bg-[#0052FF] group-hover:text-white transition-colors">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {sale.state === 1 && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between animate-pulse">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-[#0052FF]" />
                                            <span className="text-sm font-bold text-[#0052FF]">Funds Secured! Please deliver the vehicle to the buyer.</span>
                                        </div>
                                        <div className="text-xs font-bold text-[#0052FF] underline cursor-pointer">View Instructions</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MarketplaceLayout>
    );
}
