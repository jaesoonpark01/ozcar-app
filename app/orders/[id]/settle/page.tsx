"use client"

import React, { useState, useRef } from 'react'
import MarketplaceLayout from '../../../../components/layout/MarketplaceLayout'
import { CheckCircle2, ShieldAlert, PenTool, Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function finalSignOffPage() {
    const [isSigned, setIsSigned] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const settlementData = {
        totalAmount: 45200000,
        tradeInValue: 45200000,
        loanAmount: 0,
        vin: "OZCAR-KR-1234567",
        sellerId: "Ozcar Master Garage"
    }

    const handleSign = () => {
        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(false)
            setIsSigned(true)
        }, 3000)
    }

    return (
        <MarketplaceLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-12">
                    <Link href="/my-garage" className="text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center gap-2 mb-4 group">
                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Back to Garage
                    </Link>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Final Settlement Sign-off</h1>
                    <p className="text-slate-500 font-medium mt-2">Finalize the delivery and authorize the release of funds.</p>
                </div>

                {!isSigned ? (
                    <div className="space-y-8">
                        <div className="bg-[#1E293B] text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8">
                                <Lock className="w-24 h-24 text-white/5 rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Total Proceeds to Receive</p>
                                <h2 className="text-5xl font-black mb-10 tracking-tighter">₩{settlementData.totalAmount.toLocaleString()}</h2>

                                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Trade-in Value</p>
                                        <p className="text-xl font-black text-emerald-400 underline decoration-emerald-500/30">+{settlementData.tradeInValue.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Financial Disbursement</p>
                                        <p className="text-xl font-black text-blue-400">+{settlementData.loanAmount.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                            <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-[#0052FF]" />
                                Delivery Confirmation Oath
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                I, the undersigned, hereby confirm that the vehicle (VIN: <span className="text-slate-900 font-bold">{settlementData.vin}</span>) has been physically transferred and all digital assets, including the <span className="text-blue-500 font-bold">Ownership NFT</span> and <span className="text-emerald-500 font-bold">AI Trust Ledger</span>, have been updated to reflect the new ownership state.
                            </p>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5" />
                                    <p className="text-xs text-slate-600 font-bold uppercase">Technical Audit Passed by Master Garage</p>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5" />
                                    <p className="text-xs text-slate-600 font-bold uppercase">Logistics Status: COMPLETED</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center aspect-video relative group cursor-crosshair hover:bg-slate-50 transition-all">
                            <div className="text-slate-300 font-black text-xl uppercase tracking-[0.3em] pointer-events-none">Digital Signature Required</div>
                            <div className="absolute inset-4 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity">
                                <PenTool className="w-24 h-24" />
                            </div>
                        </div>

                        <button
                            onClick={handleSign}
                            disabled={isProcessing}
                            className="w-full bg-[#10B981] text-white py-6 rounded-2xl font-black text-xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {isProcessing ? "Anchoring Signature..." : "Finalize & Release Funds"}
                        </button>

                        <p className="text-center text-[11px] text-slate-400 font-mono">
                            SIGNATURE_HASH: 0x_AUTHENTICATED_SECURE_PAYMENT_PROMPT
                        </p>
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl text-center space-y-8 animate-in zoom-in-95">
                        <div className="w-24 h-24 bg-emerald-500 shadow-xl shadow-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-white text-4xl">
                            ✨
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 mb-2">Settlement Complete</h2>
                            <p className="text-slate-500 font-medium">Funds have been released to the participants&apos; wallets.</p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase">TX Hash</span>
                                <span className="text-blue-500 font-mono font-bold">0x7d...f92a</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase">Block Height</span>
                                <span className="text-slate-900 font-mono font-bold">14,892,102</span>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Link href="/my-garage" className="bg-[#0052FF] text-white px-12 py-4 rounded-xl font-black shadow-xl shadow-blue-500/20 transition-all hover:scale-105 inline-block">
                                View My Garage
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </MarketplaceLayout>
    )
}
