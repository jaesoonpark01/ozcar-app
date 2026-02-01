// app/my-garage/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import MarketplaceLayout from '../../components/layout/MarketplaceLayout';
import Link from 'next/link';
import { useWeb3 } from '../../components/Web3Provider';
import { ethers } from 'ethers';
import { useI18n } from '../../hooks/useI18n';

interface VehicleNFTBox {
    tokenId: string;
    vin: string;
    tokenURI: string;
    image: string;
    model: string;
}

export default function MyGaragePage() {
    const { account, vehicleNFT, ozcarEscrow } = useWeb3();
    const { t } = useI18n();
    const [vehicles, setVehicles] = useState<VehicleNFTBox[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [listingPrice, setListingPrice] = useState('100');
    const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
    const [status, setStatus] = useState<'IDLE' | 'APPROVING' | 'LISTING' | 'SUCCESS'>('IDLE');

    useEffect(() => {
        async function fetchMyVehicles() {
            if (!vehicleNFT || !account) {
                setIsLoading(false);
                return;
            }
            try {
                // Query Transfer events where 'to' is user
                const filter = vehicleNFT.filters.Transfer(null, account, null);
                const events = await vehicleNFT.queryFilter(filter, 0, 'latest');

                const tokenIds = [...new Set(events.map(e => (e as any).args.tokenId.toString()))];
                const ownedVehicles: VehicleNFTBox[] = [];

                for (const tid of tokenIds) {
                    try {
                        const owner = await vehicleNFT.ownerOf(tid);
                        if (owner.toLowerCase() === account.toLowerCase()) {
                            const uri = await vehicleNFT.tokenURI(tid);
                            // For demo, we get VIN from events or assume standard format
                            // We can also query VehicleRegistered events for the VIN
                            const regFilter = vehicleNFT.filters.VehicleRegistered(tid, null, null);
                            const regEvents = await vehicleNFT.queryFilter(regFilter, 0, 'latest');
                            const vin = regEvents.length > 0 ? (regEvents[0] as any).args.vin : "UNKNOWN-VIN";

                            ownedVehicles.push({
                                tokenId: tid,
                                vin,
                                tokenURI: uri,
                                image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format",
                                model: "Ozcar Registry #" + tid
                            });
                        }
                    } catch (err) { console.error("Error fetching token", tid, err); }
                }
                setVehicles(ownedVehicles);
            } catch (error) {
                console.error("Failed to fetch vehicles", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMyVehicles();
    }, [vehicleNFT, account]);

    const handleListForSale = async () => {
        if (!vehicleNFT || !ozcarEscrow || !selectedTokenId) return;
        try {
            setStatus('APPROVING');
            const escrowAddress = await ozcarEscrow.getAddress();
            const approveTx = await vehicleNFT.approve(escrowAddress, selectedTokenId);
            await approveTx.wait();

            setStatus('LISTING');
            const priceWei = ethers.parseEther(listingPrice);
            const tx = await ozcarEscrow.createEscrow(
                await vehicleNFT.getAddress(),
                selectedTokenId,
                ethers.ZeroAddress,
                priceWei
            );
            await tx.wait();

            setStatus('SUCCESS');
            setTimeout(() => setStatus('IDLE'), 3000);
            setSelectedTokenId(null);
        } catch (e) {
            console.error(e);
            alert("Listing failed");
            setStatus('IDLE');
        }
    };

    return (
        <MarketplaceLayout>
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">{t('garage_title')}</h1>
                    <p className="text-lg text-slate-500 font-medium">{t('garage_desc')}</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/my-orders" className="bg-white border-2 border-slate-100 text-slate-600 px-8 py-3 rounded-2xl font-black text-sm hover:border-slate-300 transition-all flex items-center gap-2">
                        {t('garage_orders')}
                    </Link>
                    <Link href="/sell" className="bg-[#0052FF] text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
                        {t('garage_register')}
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-slate-100 h-80 rounded-[2.5rem] animate-pulse" />
                    ))}
                </div>
            ) : vehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vehicles.map((car) => (
                        <div key={car.tokenId} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 p-8 flex flex-col gap-6 group hover:shadow-2xl transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#0052FF] transition-colors">{car.model}</h3>
                                    <p className="text-xs text-slate-400 font-mono mt-1">VIN: {car.vin}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="bg-blue-50 text-[#0052FF] text-[10px] font-black px-3 py-1.5 rounded-full border border-blue-100 uppercase">Token #{car.tokenId}</span>
                                    <Link href={`/explorer?vin=${car.vin}`} className="text-[10px] font-bold text-[#0052FF] hover:underline flex items-center gap-1">
                                        {t('garage_view_timeline')} ↗
                                    </Link>
                                    <Link href={`/vehicle/ar-demo?vin=${car.vin}`} className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1">
                                        {t('garage_inspect_ar')} 🌌
                                    </Link>
                                    <Link href={`/my-garage/resale-consulting?vin=${car.vin}`} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                                        {t('garage_consult_value')} 📈
                                    </Link>
                                    <Link href={`/service/book?vin=${car.vin}`} className="text-[10px] font-bold text-slate-500 hover:underline flex items-center gap-1">
                                        {t('garage_book_service')} 🔧
                                    </Link>
                                </div>
                            </div>

                            <div className="aspect-[4/3] bg-slate-50 rounded-3xl overflow-hidden relative">
                                <img src={car.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            {selectedTokenId === car.tokenId ? (
                                <div className="bg-slate-50 p-6 rounded-3xl border border-[#0052FF] animate-in slide-in-from-bottom-4">
                                    <div className="mb-4">
                                        <label className="text-xs font-black text-[#0052FF] uppercase mb-2 block">Set Sale Price (OZC)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={listingPrice}
                                                onChange={e => setListingPrice(e.target.value)}
                                                className="w-full pl-4 pr-12 py-3 bg-white border border-blue-100 rounded-xl font-black text-slate-900 text-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">OZC</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleListForSale}
                                            disabled={status !== 'IDLE'}
                                            className="flex-1 bg-[#0052FF] text-white py-3 rounded-xl font-black text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-600 disabled:opacity-50 transition-all"
                                        >
                                            {status === 'IDLE' ? t('garage_confirm_list') : t('garage_processing')}
                                        </button>
                                        <button
                                            onClick={() => setSelectedTokenId(null)}
                                            className="px-4 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-100"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setSelectedTokenId(car.tokenId)}
                                    className="w-full border-2 border-slate-100 py-4 rounded-2xl font-black text-slate-600 hover:border-[#0052FF] hover:text-[#0052FF] hover:bg-blue-50/50 transition-all"
                                >
                                    {t('garage_list_sale')}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center">
                    <div className="text-6xl mb-6 opacity-30">🚙</div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">{t('garage_empty')}</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">{t('garage_empty_desc')}</p>
                    <Link href="/sell" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all inline-block shadow-2xl">
                        {t('garage_register')}
                    </Link>
                </div>
            )}

            {status === 'SUCCESS' && (
                <div className="fixed bottom-10 right-10 z-[100] bg-[#10B981] text-white p-8 rounded-3xl shadow-[0_20px_60px_rgba(16,185,129,0.3)] animate-in slide-in-from-right flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">✅</div>
                    <div>
                        <h3 className="font-black text-xl mb-1">{t('garage_success_title')}</h3>
                        <p className="text-sm opacity-80">{t('garage_success_desc')}</p>
                    </div>
                </div>
            )}
        </MarketplaceLayout>
    );
}

