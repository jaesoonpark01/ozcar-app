// app/governance/page.tsx
"use client";

import React, { useState } from 'react';
import MarketplaceLayout from '../../components/layout/MarketplaceLayout';
import { useWeb3 } from '../../components/Web3Provider';
import { Shield, CheckCircle, XCircle, AlertTriangle, Eye, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface AuditCase {
    id: string;
    vin: string;
    technician: string;
    mileage: string;
    timestamp: string;
    status: 'PENDING' | 'VALIDATED' | 'SPAM';
}

const MOCK_CASES: AuditCase[] = [
    { id: "AC-501", vin: "WBA71...9082", technician: "0x88...f2e", mileage: "45,210", timestamp: "2h ago", status: 'PENDING' },
    { id: "AC-502", vin: "WBA71...9083", technician: "0x31...a1c", mileage: "12,000", timestamp: "5h ago", status: 'PENDING' },
    { id: "AC-503", vin: "WBA71...9084", technician: "0x9a...b44", mileage: "89,500", timestamp: "1d ago", status: 'PENDING' },
];

export default function GovernancePage() {
    const { reputation, account } = useWeb3();
    const [cases, setCases] = useState<AuditCase[]>(MOCK_CASES);

    const isAuthorized = (reputation || 0) >= 80;

    const handleVote = (id: string, newStatus: 'VALIDATED' | 'SPAM') => {
        setCases(cases.map(c => c.id === id ? { ...c, status: newStatus } : c));
        alert(`${newStatus === 'VALIDATED' ? 'Upvoted' : 'Flagged'} case ${id}. Reputation reward queued.`);
    };

    if (!account) return (
        <MarketplaceLayout>
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <Shield className="w-16 h-16 text-slate-200 mb-6" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">Connect Wallet</h2>
                <p className="text-slate-500 max-w-xs mx-auto">Authorize your identities to participate in the Ozcar Jury portal.</p>
            </div>
        </MarketplaceLayout>
    );

    if (!isAuthorized) return (
        <MarketplaceLayout>
            <div className="max-w-3xl mx-auto py-24">
                <div className="bg-red-50 border border-red-100 rounded-[3rem] p-16 text-center">
                    <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-8" />
                    <h2 className="text-4xl font-black text-slate-900 mb-4">Access Denied</h2>
                    <p className="text-slate-600 text-lg font-medium mb-12">
                        The Governance portal is exclusive to **High Reputation (REP 80+)** technicians.
                        Your current score is <span className="text-[#0052FF] font-black">{reputation}</span>.
                    </p>
                    <Link href="/wallet" className="bg-[#0052FF] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                        Boost My Reputation
                    </Link>
                </div>
            </div>
        </MarketplaceLayout>
    );

    return (
        <MarketplaceLayout>
            <div className="max-w-6xl mx-auto py-10 px-4">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Governance <span className="text-[#0052FF]">Portal</span></h1>
                            <span className="bg-[#0052FF]/10 text-[#0052FF] px-4 py-1 rounded-full text-[10px] font-black uppercase">Jury Active</span>
                        </div>
                        <p className="text-slate-500 font-medium">Earn rewards by reviewing and validating new maintenance logs.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-sans">Member Status</div>
                        <div className="text-xl font-black text-[#10B981] flex items-center gap-2 justify-end">
                            <CheckCircle className="w-5 h-5" /> Authorized
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Stats Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Voting Power</h3>
                            <div className="text-5xl font-black mb-2">{reputation * 10}</div>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Your voting power is relative to your staked OZC and consistent participation.</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Your Impact</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between font-bold text-sm">
                                    <span className="text-slate-400">Total Votes</span>
                                    <span>24</span>
                                </div>
                                <div className="flex justify-between font-bold text-sm">
                                    <span className="text-slate-400">Accuracy</span>
                                    <span className="text-[#10B981]">98%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Cases */}
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Pending Peer Review</h3>
                        {cases.map((audit) => (
                            <div key={audit.id} className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group ${audit.status !== 'PENDING' ? 'opacity-40 grayscale' : ''}`}>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📋</div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-black text-slate-900">{audit.id}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">• {audit.timestamp}</span>
                                            </div>
                                            <h4 className="text-xl font-black text-slate-800">Verification for VIN: <span className="font-mono text-[#0052FF]">{audit.vin}</span></h4>
                                            <p className="text-xs text-slate-500 font-medium">Technician: {audit.technician} • Reported Mileage: {audit.mileage} km</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        {audit.status === 'PENDING' ? (
                                            <>
                                                <button
                                                    onClick={() => handleVote(audit.id, 'VALIDATED')}
                                                    className="flex-1 md:flex-none p-4 rounded-xl bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981] hover:text-white transition-all shadow-sm"
                                                >
                                                    <CheckCircle className="w-6 h-6" />
                                                </button>
                                                <button
                                                    onClick={() => handleVote(audit.id, 'SPAM')}
                                                    className="flex-1 md:flex-none p-4 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <XCircle className="w-6 h-6" />
                                                </button>
                                                <button className="flex-1 md:flex-none p-4 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all shadow-sm">
                                                    <Eye className="w-6 h-6" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest ${audit.status === 'VALIDATED' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-red-50 text-red-500'}`}>
                                                {audit.status}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
                            <p className="text-slate-400 font-bold mb-4">No more cases currently awaiting your tier review.</p>
                            <Link href="/wallet" className="text-sm font-black text-[#0052FF] flex items-center justify-center gap-1 hover:underline">
                                Boost Reputation for Tier 2 access <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
