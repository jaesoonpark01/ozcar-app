// app/wallet/page.tsx
"use client";

import React, { useState } from 'react';
import MarketplaceLayout from '../../components/layout/MarketplaceLayout';
import { useWeb3 } from '../../components/Web3Provider';
import { ethers } from 'ethers';
import { Shield, TrendingUp, Lock, RefreshCw, Award, Activity } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

export default function WalletPage() {
    const { account, balance, reputation, techStats, ozcarToken, stakeOZC, unstakeOZC, refreshData } = useWeb3();
    const { t } = useI18n();
    const [faucetStatus, setFaucetStatus] = useState<'IDLE' | 'CLAIMING' | 'SUCCESS'>('IDLE');
    const [stakeAmount, setStakeAmount] = useState('');
    const [isStaking, setIsStaking] = useState(false);

    const handleFaucet = async () => {
        if (!ozcarToken || !account) return;
        try {
            setFaucetStatus('CLAIMING');
            try {
                const tx = await ozcarToken.mint(account, ethers.parseEther("500"));
                await tx.wait();
            } catch (e) {
                console.log("Not owner, simulated faucet...");
                await new Promise(r => setTimeout(r, 1500));
            }
            await refreshData();
            setFaucetStatus('SUCCESS');
            setTimeout(() => setFaucetStatus('IDLE'), 3000);
        } catch (error) {
            console.error(error);
            setFaucetStatus('IDLE');
        }
    };

    const onStake = async () => {
        if (!stakeAmount || isNaN(Number(stakeAmount))) return;
        setIsStaking(true);
        try {
            await stakeOZC(stakeAmount);
            setStakeAmount('');
            alert("Staking Successful! Reputation recalculated.");
        } catch (e) {
            alert("Staking failed. Make sure you have enough OZC.");
        } finally {
            setIsStaking(false);
        }
    };

    return (
        <MarketplaceLayout>
            <div className="max-w-6xl mx-auto py-10 px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight" dangerouslySetInnerHTML={{ __html: t('wallet_title') }} />
                        <p className="text-slate-500 font-medium mt-2">{t('wallet_desc')}</p>
                    </div>
                    <button onClick={() => refreshData()} className="p-3 bg-white rounded-full border border-slate-100 shadow-sm hover:rotate-180 transition-all duration-500">
                        <RefreshCw className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Wallet Card */}
                    <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="mb-12">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-[#0052FF] rounded-lg" />
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">{t('wallet_portfolio')}</span>
                                </div>
                                <div className="text-8xl font-black tracking-tighter flex items-center gap-6">
                                    {parseFloat(balance).toLocaleString()}
                                    <span className="text-2xl font-bold bg-white/10 px-4 py-2 rounded-2xl text-[#0052FF]">OZC</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleFaucet}
                                    disabled={faucetStatus !== 'IDLE'}
                                    className="bg-[#0052FF] text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all disabled:bg-slate-700 disabled:text-slate-400 flex items-center justify-center gap-3"
                                >
                                    {faucetStatus === 'CLAIMING' ? t('wallet_faucet_claiming') : t('wallet_faucet_btn')}
                                    <Award className="w-5 h-5" />
                                </button>
                                <button className="bg-white/5 border border-white/10 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all">
                                    {t('wallet_history_btn')}
                                </button>
                            </div>
                        </div>
                        {/* Abstract Background Design */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0052FF]/20 rounded-full blur-[100px] -mr-48 -mt-48" />
                    </div>

                    {/* Staking / Reputation Summary */}
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl flex flex-col justify-between group">
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('wallet_rep_title')}</span>
                                <Shield className="w-5 h-5 text-[#0052FF]" />
                            </div>
                            <div className="text-center">
                                <div className="text-8xl font-black text-slate-900 tracking-tighter mb-2">{reputation}</div>
                                <div className="inline-block px-4 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-[10px] font-black uppercase">Verified Tier 1</div>
                            </div>
                        </div>

                        <div className="mt-10 space-y-4">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-[#0052FF]/5 group-hover:border-[#0052FF]/20 transition-all">
                                <div className="text-[10px] font-black text-slate-400 uppercase mb-2">{t('wallet_staked_label')}</div>
                                <div className="text-2xl font-black text-slate-900">{techStats?.tokenStake || "0.0"} <span className="text-sm">OZC</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Detailed Stats */}
                    {[
                        { label: 'Consistency', value: techStats?.consistencyScore || 0, color: 'text-blue-500', icon: <Activity className="w-4 h-4" /> },
                        { label: 'Participation', value: techStats?.participationScore || 0, color: 'text-emerald-500', icon: <TrendingUp className="w-4 h-4" /> },
                        { label: 'Jury Duty', value: techStats?.juryScore || 0, color: 'text-purple-500', icon: <Award className="w-4 h-4" /> },
                        { label: 'Verification Limit', value: reputation * 2, color: 'text-amber-500', icon: <Shield className="w-4 h-4" /> }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className={`${stat.color} p-2 bg-slate-50 rounded-lg`}>{stat.icon}</div>
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{stat.label}</span>
                            </div>
                            <div className="text-3xl font-black text-slate-900">{stat.value}%</div>
                        </div>
                    ))}
                </div>

                {/* Staking Section */}
                <div className="bg-gradient-to-r from-[#0052FF] to-[#00A3FF] rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-12 mb-12 relative overflow-hidden">
                    <div className="relative z-10 max-w-lg text-center md:text-left">
                        <h2 className="text-4xl font-black mb-4">{t('wallet_stake_title')}</h2>
                        <p className="opacity-80 font-medium">{t('wallet_stake_desc')}</p>
                    </div>

                    <div className="relative z-10 w-full md:w-auto bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20">
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-4 opacity-60">Amount to Stake</label>
                        <div className="flex gap-4">
                            <input
                                value={stakeAmount}
                                onChange={e => setStakeAmount(e.target.value)}
                                className="flex-1 bg-transparent border-b-2 border-white/30 outline-none text-3xl font-black placeholder:text-white/20"
                                placeholder="0.0"
                            />
                            <button
                                onClick={onStake}
                                disabled={isStaking || !stakeAmount}
                                className="bg-white text-[#0052FF] px-10 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isStaking ? t('wallet_processing') : t('wallet_stake_btn')}
                            </button>
                        </div>
                        <div className="mt-4 flex justify-between items-center text-xs font-bold">
                            <span className="opacity-60">{t('wallet_available')}: {parseFloat(balance).toLocaleString()} OZC</span>
                            <button onClick={() => setStakeAmount(balance)} className="text-white underline underline-offset-4">Max</button>
                        </div>
                    </div>
                </div>

                {/* Reputation Formula Visualization */}
                <div className="bg-slate-50 rounded-[3rem] p-12 text-center border border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Reputation Index Calculation</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-black text-slate-800">Performance</span>
                            <span className="text-slate-400 font-bold">70% Weight</span>
                        </div>
                        <div className="text-4xl text-slate-300 font-light">+</div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-black text-slate-800">Staking</span>
                            <span className="text-slate-400 font-bold">30% Weight</span>
                        </div>
                        <div className="text-4xl text-slate-300 font-light">=</div>
                        <div className="flex flex-col items-center group">
                            <span className="text-6xl font-black text-[#0052FF] group-hover:scale-110 transition-transform">{reputation}</span>
                            <span className="text-[#0052FF] font-black text-xs uppercase tracking-widest">Score</span>
                        </div>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
