"use client"

import React, { useState } from 'react'
import MarketplaceLayout from '../../components/layout/MarketplaceLayout'
import { Landmark, ArrowRight, ShieldCheck, Percent, Wallet, Info } from 'lucide-react'
import Link from 'next/link'

export default function TradeInPage() {
    const [step, setStep] = useState(1)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleApply = () => {
        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(false)
            setStep(2)
        }, 2500)
    }

    return (
        <MarketplaceLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0052FF] px-4 py-2 rounded-full text-xs font-black uppercase mb-6 tracking-widest border border-blue-100">
                        <Landmark className="w-4 h-4" />
                        Blockchain-Linked Financing
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Trade-in Hub</h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        Leverage your verified vehicle history to unlock premium low-interest loans from our banking partners.
                    </p>
                </div>

                {step === 1 ? (
                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Trade-in Vehicle</h3>
                                    <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl">🚙</div>
                                        <div>
                                            <h4 className="font-black text-slate-900">Tesla Model 3</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">VIN: OZCAR-KR-1234567</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-[#0052FF]/5 rounded-[2rem] border border-[#0052FF]/10">
                                    <div className="flex items-center gap-2 text-[#0052FF] mb-2">
                                        <ShieldCheck className="w-5 h-5" />
                                        <span className="font-black text-sm uppercase">Trust Premium Applied</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Based on your 100% genuine-part service records, you qualify for our <strong>Trust-Tier 1</strong> interest rate.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Financial Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-4 border-b border-slate-50">
                                        <span className="text-slate-500 font-medium">Appraised Equity</span>
                                        <span className="font-black text-slate-900">₩45,200,000</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-b border-slate-50">
                                        <span className="text-slate-500 font-medium">Interest Rate (APR)</span>
                                        <div className="text-right">
                                            <span className="line-through text-slate-300 mr-2 text-xs">5.8%</span>
                                            <span className="font-black text-emerald-500">2.5%</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-4 text-xl">
                                        <span className="font-black text-slate-900">Total Credit Line</span>
                                        <span className="font-black text-[#0052FF]">₩1.2B MAX</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleApply}
                                    disabled={isProcessing}
                                    className="w-full bg-[#0052FF] text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-500/30 hover:scale-[1.02] transition-all disabled:opacity-50"
                                >
                                    {isProcessing ? "Verifying On-chain Assets..." : "Apply with One-click"}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-emerald-500 text-white rounded-[3rem] p-16 text-center shadow-2xl shadow-emerald-500/20 animate-in zoom-in-95">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShieldCheck className="w-12 h-12" />
                        </div>
                        <h2 className="text-4xl font-black mb-4">Loan Approved!</h2>
                        <p className="text-emerald-50 text-xl font-medium max-w-xl mx-auto mb-10">
                            Your trade-in certificate has been issued as a soulbound NFT. You can now use this credit at any certified Ozcar dealership.
                        </p>
                        <div className="bg-black/10 rounded-2xl p-6 mb-12 flex items-center justify-between max-w-sm mx-auto border border-white/10">
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase text-emerald-200 mb-1">TX Hash</p>
                                <p className="font-mono text-xs">0x71c...3f2ae49</p>
                            </div>
                            <Percent className="w-8 h-8 opacity-50" />
                        </div>
                        <div className="flex justify-center gap-4">
                            <Link href="/my-garage" className="bg-white text-emerald-600 px-10 py-4 rounded-xl font-black text-sm hover:scale-105 transition-all">
                                My Wallet
                            </Link>
                            <Link href="/marketplace" className="bg-emerald-600 border border-emerald-400 px-10 py-4 rounded-xl font-black text-sm hover:bg-emerald-700 transition-all">
                                Browse New Cars
                            </Link>
                        </div>
                    </div>
                )}

                <div className="mt-20 flex gap-8">
                    <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-100 flex gap-6">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Wallet className="w-6 h-6 text-[#0052FF]" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-800 mb-1">Direct Settlement</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Funds are directly settled into the escrow contract, eliminating intermediate steps.</p>
                        </div>
                    </div>
                    <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-100 flex gap-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Info className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-800 mb-1">How it works</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">AI analyzes your on-chain records. Higher trust scores mean lower interest rates.</p>
                        </div>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    )
}
