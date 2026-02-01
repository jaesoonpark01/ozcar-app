// components/layout/MarketplaceLayout.tsx
"use client";

import React from 'react';
import { useWeb3 } from '../Web3Provider';
import Link from 'next/link';
import { useI18n } from '../../hooks/useI18n';
import { Languages } from 'lucide-react';

interface Props {
    children: React.ReactNode;
}

const MarketplaceLayout: React.FC<Props> = ({ children }) => {
    const { account, balance, reputation, connectWallet } = useWeb3();
    const { t, lang, toggleLanguage } = useI18n();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-6 py-4 flex justify-between items-center">
                <Link href="/marketplace" className="text-2xl font-black text-[#0052FF] tracking-tighter">
                    OZCAR
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-8 mr-12 ml-4">
                        <Link href="/sell" className="text-sm font-black text-slate-400 hover:text-slate-900 transition-colors">{t('nav_sell')}</Link>
                        <Link href="/explorer" className="text-sm font-black text-slate-400 hover:text-slate-900 transition-colors">{t('nav_explorer')}</Link>
                        <Link href="/governance/report" className="text-sm font-black text-slate-400 hover:text-slate-900 transition-colors">{t('nav_trust')}</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/my-orders" className="text-sm font-black text-slate-400 hover:text-slate-900 transition-colors">
                            {t('nav_orders')}
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-white transition-all text-slate-400 hover:text-slate-900"
                        >
                            <Languages className="w-3.5 h-3.5" />
                            {lang === 'ko' ? 'EN' : 'KO'}
                        </button>

                        {account ? (
                            <div className="flex items-center gap-3">
                                <div className="bg-[#10B981]/10 rounded-xl px-4 py-2 text-xs font-black text-[#10B981] border border-[#10B981]/10 flex items-center gap-2">
                                    <span className="text-[10px] opacity-60">🏆 REP</span>
                                    {reputation}
                                </div>
                                <Link href="/wallet" className="bg-slate-100 rounded-xl px-4 py-2 text-xs font-black text-[#0052FF] border border-blue-50 hover:bg-white transition-all flex items-center gap-2">
                                    <span className="text-[10px] opacity-40">OZC</span>
                                    {parseFloat(balance).toLocaleString()}
                                </Link>
                                <div className="bg-slate-100 rounded-full px-4 py-2 text-xs font-mono font-bold text-slate-600 border border-slate-200 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                                    {account.substring(0, 6)}...{account.substring(38)}
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={connectWallet}
                                className="bg-[#0052FF] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                            >
                                {t('nav_connect')}
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default MarketplaceLayout;
