// app/technician/[address]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import MarketplaceLayout from '../../../components/layout/MarketplaceLayout';
import { useParams } from 'next/navigation';
import { ShieldCheck, Star, Award, History, CheckCircle2, MessageSquare, Heart, Share2 } from 'lucide-react';

export default function TechnicianProfilePage() {
    const params = useParams();
    const address = params?.address as string;
    const [activeTab, setActiveTab] = useState<'HISTORY' | 'REVIEWS'>('HISTORY');

    // Mock Profile Data
    const profile = {
        name: "Ozcar Master Garage",
        handle: "@master_k",
        address: address,
        since: "2024. 03",
        reputation: 98,
        totalJobs: 1420,
        specialties: ["EV Diagnosis", "Battery Cell Balancing", "Precision Calibration"],
        bio: "Specializing in next-gen EV maintenance and high-precision sensor calibration. 10+ years experience in the luxury EV market.",
        rating: 4.9,
        reviews: 284
    };

    return (
        <MarketplaceLayout>
            <div className="max-w-6xl mx-auto pb-20">
                {/* 1. Profile Header */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm mb-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-xl">
                            🚗
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
                                <div className="bg-[#10B981] text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Certified Master
                                </div>
                            </div>
                            <p className="text-slate-400 font-mono text-sm mb-6">{address}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reputation</div>
                                    <div className="text-2xl font-black text-[#0052FF]">{profile.reputation}%</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Assets Signed</div>
                                    <div className="text-2xl font-black text-slate-900">{profile.totalJobs.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">User Rating</div>
                                    <div className="flex items-center gap-1">
                                        <div className="text-2xl font-black text-slate-900">{profile.rating}</div>
                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Member Since</div>
                                    <div className="text-2xl font-black text-slate-900">{profile.since}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Bio & Specialties */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Official Bio</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">{profile.bio}</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Core Specialties</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.specialties.map(s => (
                                    <span key={s} className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-600">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 h-14 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                            <button className="flex-1 bg-[#0052FF] text-white h-14 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                                <Heart className="w-4 h-4" /> Follow
                            </button>
                        </div>
                    </div>

                    {/* Right: Content Tabs */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex border-b border-slate-100">
                            <button
                                onClick={() => setActiveTab('HISTORY')}
                                className={`px-8 py-5 text-sm font-black transition-all relative ${activeTab === 'HISTORY' ? 'text-[#0052FF]' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Certification History
                                {activeTab === 'HISTORY' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0052FF] rounded-t-full" />}
                            </button>
                            <button
                                onClick={() => setActiveTab('REVIEWS')}
                                className={`px-8 py-5 text-sm font-black transition-all relative ${activeTab === 'REVIEWS' ? 'text-[#0052FF]' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Community Reviews
                                {activeTab === 'REVIEWS' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0052FF] rounded-t-full" />}
                            </button>
                        </div>

                        {activeTab === 'HISTORY' ? (
                            <div className="space-y-6">
                                {[
                                    { id: 'OZ-701', type: 'FULL_INSPECTION', date: '2026. 01. 28', asset: 'Tesla Model 3 Long Range', status: 'VERIFIED' },
                                    { id: 'OZ-695', type: 'BATTERY_SERVICE', date: '2026. 01. 25', asset: 'Hyundai Ioniq 5', status: 'VERIFIED' },
                                    { id: 'OZ-682', type: 'TIRE_ROTATION', date: '2026. 01. 20', asset: 'Genesis GV60', status: 'VERIFIED' }
                                ].map(item => (
                                    <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-[#0052FF]/20 transition-all flex justify-between items-center group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0052FF] group-hover:bg-[#0052FF] group-hover:text-white transition-colors">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date} • {item.id}</div>
                                                <div className="text-lg font-black text-slate-900">{item.asset}</div>
                                                <div className="text-xs font-bold text-slate-500 opacity-60">{item.type}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-emerald-50 text-emerald-500 text-[10px] font-black px-3 py-1.5 rounded-full border border-emerald-100">IMMUTABLE</span>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">Load More Records ▾</button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {[
                                    { user: '0x123...abc', comment: "Fast and professional. The blockchain record was uploaded instantly. Highly recommended for EV owners!", rating: 5, date: '2 days ago' },
                                    { user: '0x789...def', comment: "Excellent battery diagnosis. Shared the detailed report via IPFS. Transparent service.", rating: 5, date: '1 week ago' }
                                ].map((review, i) => (
                                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full" />
                                                <div>
                                                    <div className="text-xs font-black text-slate-900">{review.user}</div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{review.date}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
                                            </div>
                                        </div>
                                        <p className="text-slate-600 font-medium leading-relaxed italic">&quot;{review.comment}&quot;</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
