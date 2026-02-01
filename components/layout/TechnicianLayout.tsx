// components/layout/TechnicianLayout.tsx
"use client";

import React from 'react';
import { useWeb3 } from '../Web3Provider';
import Link from 'next/link';

interface Props {
    children: React.ReactNode;
    title: string;
}

const TechnicianLayout: React.FC<Props> = ({ children, title }) => {
    const { balance, reputation, account } = useWeb3();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
            {/* Dashboard Header */}
            <header className="bg-[#0052FF] text-white p-6 rounded-b-[2rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/" className="text-xl font-black tracking-tighter">OZCAR <span className="text-xs opacity-50 font-normal">TECH</span></Link>
                    <div className="flex gap-2">
                        <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold border border-white/10">
                            REP {reputation}
                        </div>
                        <div className="bg-emerald-400/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-400/20">
                            ONLINE
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs opacity-60 font-black uppercase tracking-wider">Total Earnings</p>
                        <h1 className="text-4xl font-black mt-1 leading-none">{parseFloat(balance).toLocaleString()} <span className="text-lg opacity-40">OZC</span></h1>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] opacity-60 font-bold">ADDRESS</p>
                        <p className="text-[10px] font-mono opacity-80">{account?.substring(0, 10)}...</p>
                    </div>
                </div>
            </header>

            <main className="p-4">
                {title && <h2 className="text-2xl font-bold my-4 text-[#1E293B] px-1">{title}</h2>}
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-slate-200/50 flex justify-around p-4 shadow-2xl z-50 rounded-3xl">
                <Link href="/technician/dashboard" className="flex flex-col items-center gap-1 text-[#0052FF]">
                    <div className="text-xl">⛏️</div>
                    <span className="font-bold text-[10px]">Mining</span>
                </Link>
                <Link href="/explorer" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <div className="text-xl">🔍</div>
                    <span className="font-bold text-[10px]">Explorer</span>
                </Link>
                <Link href="/wallet" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <div className="text-xl">💳</div>
                    <span className="font-bold text-[10px]">My Wallet</span>
                </Link>
                <Link href="/governance" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <div className="text-xl">⚖️</div>
                    <span className="font-bold text-[10px]">Gov</span>
                </Link>
            </nav>
        </div>
    );
};

export default TechnicianLayout;
