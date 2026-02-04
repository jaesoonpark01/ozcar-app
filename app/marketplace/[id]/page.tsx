// app/marketplace/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import MarketplaceLayout from '../../../components/layout/MarketplaceLayout';
import PurchaseAction from '../../../components/marketplace/PurchaseAction';
import { MiningService } from '../../../services/miningService';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, Zap, Sparkles, AlertCircle, BarChart, Info, Star, Lock as LockIcon, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const getVehicleBaseInfo = (id: string) => {
    return {
        id: id || "1",
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200",
        model: "Tesla Model 3 Long Range",
        price: "35,000",
        mileage: 12000,
        year: 2023,
        location: "Seoul, Gangnam",
        isCertified: true,
        vin: "OZCAR-KR-TEST-001",
        description: "Immaculate condition, single owner. Full maintenance history executed by Ozcar Certified Technicians.",
        specs: [
            { label: "Range", value: "576 km", icon: <Zap className="w-3 h-3" /> },
            { label: "0-100 km/h", value: "4.4 sec", icon: <Sparkles className="w-3 h-3" /> },
            { label: "Drive", value: "AWD", icon: <Info className="w-3 h-3" /> },
            { label: "Color", value: "Pearl White", icon: <Sparkles className="w-3 h-3" /> }
        ]
    };
};

export default function VehicleDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const vehicle = React.useMemo(() => getVehicleBaseInfo(id), [id]);
    const [history, setHistory] = useState<{ type: string; timestamp: string; txHash: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const records = await MiningService.getVehicleHistory(vehicle.vin);
                setHistory(records);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchHistory();
    }, [vehicle.vin]);

    return (
        <MarketplaceLayout>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-20">
                {/* Left: Enhanced Visuals & Spec Grid */}
                <div className="space-y-10">
                    <div className="rounded-[3rem] overflow-hidden shadow-2xl bg-slate-900 aspect-[4/3] relative group">
                        <Image
                            src={vehicle.image}
                            alt={vehicle.model}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />

                        <div className="absolute top-8 left-8">
                            <Link href={`/vehicle/ar-demo?vin=${vehicle.vin}`} className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-white hover:text-slate-900 transition-all flex items-center gap-3">
                                <Sparkles className="w-4 h-4 text-emerald-400" /> ENTER REALITY ENGINE
                            </Link>
                        </div>

                        <div className="absolute bottom-8 left-8">
                            <div className="flex gap-2">
                                <div className="bg-[#10B981] text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase">Verified Asset</div>
                                <div className="bg-[#0052FF] text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase">Layer 2 Anchored</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {vehicle.specs.map(spec => (
                            <div key={spec.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-[#0052FF]/20 transition-all">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0052FF] group-hover:bg-[#0052FF] group-hover:text-white transition-colors">
                                    {spec.icon}
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{spec.label}</div>
                                    <div className="text-slate-900 font-black text-lg">{spec.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AI Value Insight (New CRM Component) */}
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white overflow-hidden relative">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart className="w-5 h-5 text-[#0052FF]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Ozcar AI Value Score</span>
                            </div>
                            <div className="flex items-end gap-3 mb-8">
                                <div className="text-7xl font-black tracking-tighter">98<span className="text-2xl text-[#0052FF]">/100</span></div>
                                <div className="text-emerald-400 font-black text-xs mb-3 flex items-center gap-1">
                                    <ShieldCheck className="w-4 h-4" /> ELITE TRUST GAIN
                                </div>
                            </div>
                            <p className="text-sm font-medium opacity-60 leading-relaxed max-w-sm">
                                Based on {history.length} verified maintenance records and zero reported disputes.
                                Estimated resale stability: <span className="text-white opacity-100 font-black">Top 2% of Model 3 fleet</span>.
                            </p>
                        </div>
                        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#0052FF]/20 rounded-full blur-[80px]" />
                    </div>
                </div>

                {/* Right: Info, Price & Immutable History */}
                <div className="space-y-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-[#0052FF]/10 text-[#0052FF] text-[10px] font-black px-4 py-1.5 rounded-full border border-[#0052FF]/10 uppercase tracking-widest">VIN Verified</div>
                            <span className="text-slate-300 font-black text-[10px]">AUTH_HASH: 0x72...9A3</span>
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter leading-[0.9]">{vehicle.model}</h1>
                        <div className="flex items-center gap-4 text-slate-400 font-bold text-lg">
                            <span>{vehicle.year} MY</span>
                            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                            <span>{vehicle.mileage.toLocaleString()} KM</span>
                            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                            <span>{vehicle.location}</span>
                        </div>
                    </div>

                    <PurchaseAction price={vehicle.price} tokenId={vehicle.id} sellerAddress="0x789...123" />

                    {/* Immutable Provenance Record */}
                    <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="font-black text-slate-900 text-xl tracking-tight">Trust Provenance</h3>
                                <p className="text-xs text-slate-400 font-bold">Ledger Integrity: 100% Verified</p>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-2xl">
                                <ShieldCheck className="w-6 h-6 text-[#10B981]" />
                            </div>
                        </div>

                        {!isUnlocked ? (
                            <div className="relative">
                                {/* Blurred Placeholder */}
                                <div className="space-y-8 opacity-20 blur-md select-none pointer-events-none">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex gap-10">
                                            <div className="w-4 ml-4 h-20 bg-slate-100 rounded-full" />
                                            <div className="space-y-4 flex-1">
                                                <div className="h-4 w-32 bg-slate-200 rounded" />
                                                <div className="h-8 w-64 bg-slate-200 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Overlay Barrier */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/90 backdrop-blur-xl border border-white/20 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm border border-slate-100">
                                        <div className="w-16 h-16 bg-[#0052FF]/10 text-[#0052FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <LockIcon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2">Unlock Trust Ledger</h3>
                                        <p className="text-slate-500 font-medium text-xs mb-8 leading-relaxed px-4">
                                            Viewing professional maintenance reports, IPFS evidence, and tech reputation records requires a protocol fee.
                                        </p>
                                        <button
                                            onClick={() => setIsUnlocked(true)}
                                            className="w-full bg-slate-900 text-white h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#0052FF] transition-all shadow-xl shadow-blue-500/10"
                                        >
                                            QUERY PROTOCOL (50 OZC)
                                        </button>
                                        <p className="text-[9px] font-black text-slate-400 mt-4 uppercase tracking-widest">
                                            50% Rewards Data Contributors
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative border-l-4 border-slate-100 pl-10 space-y-12 ml-4 animate-in fade-in duration-700">
                                {isLoading ? (
                                    <div className="flex items-center gap-3 text-slate-400 font-bold animate-pulse">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" /> Querying Oracles...
                                    </div>
                                ) : history.length > 0 ? (
                                    history.map((item, idx) => (
                                        <div key={idx} className="relative group/item">
                                            <div className="absolute -left-[54px] top-1 w-10 h-10 rounded-full bg-white border-4 border-slate-100 group-hover/item:border-[#0052FF] transition-colors flex items-center justify-center p-1 shadow-sm">
                                                {item.type === 'REGISTRATION' ? <Zap className="w-3 h-3 text-[#0052FF]" /> : <Wrench className="w-3 h-3 text-emerald-500" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">{item.type}</span>
                                                    <span className="text-[10px] font-black text-slate-300">{item.timestamp}</span>
                                                </div>
                                                <h4 className="text-lg font-black text-slate-800">
                                                    {item.type === 'REGISTRATION' ? 'Identity Minted' : 'Full System Audit'}
                                                </h4>
                                                <div className="text-[10px] font-mono font-bold text-[#0052FF] mt-2 select-all cursor-copy flex items-center gap-2">
                                                    TX: {item.txHash} <ExternalLink className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 flex items-center gap-4">
                                        <AlertCircle className="w-6 h-6 text-slate-300" />
                                        <p className="text-sm text-slate-400 font-bold">No certified history found for this specific VIN identifier on the Ozcar Protocol.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-10 bg-blue-50 rounded-[3rem] border border-blue-100 relative group overflow-hidden">
                        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                            Seller&apos;s Insight <Zap className="w-4 h-4 text-[#0052FF]" />
                        </h3>
                        <p className="text-slate-600 font-medium leading-[1.6]">
                            &quot;{vehicle.description}&quot;
                        </p>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-slate-900 text-xl tracking-tight">Community Feedback</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-slate-900">4.8</span>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {[
                                { user: 'CryptoRider', text: "Saw the maintenance logs on-chain. This tech (@master_k) is the best in Seoul. Extremely clean car." },
                                { user: 'EVSwap_KR', text: "Verified the Battery Audit via AR. Everything matched the ledger. Safe buy." }
                            ].map((review, i) => (
                                <div key={i} className="bg-slate-50 p-6 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 bg-slate-200 rounded-full" />
                                        <span className="text-xs font-black text-slate-800">{review.user}</span>
                                        <span className="text-[10px] font-bold text-slate-400 opacity-60">Verified Buyer</span>
                                    </div>
                                    <p className="text-xs text-slate-600 font-medium italic">&quot;{review.text}&quot;</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}

const Wrench = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
);
