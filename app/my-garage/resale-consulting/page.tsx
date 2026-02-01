"use client"

import React, { useState, useEffect } from 'react'
import MarketplaceLayout from '../../../components/layout/MarketplaceLayout'
import { TrendingUp, Calendar, Target, ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function ResaleConsultingPage() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1000)
    }, [])

    const forecastData = [
        { date: "2026.02", value: 4520, status: "PEAK" },
        { date: "2026.08", value: 4200, status: "NORMAL" },
        { date: "2027.02", value: 3850, status: "STEEP" },
    ]

    return (
        <MarketplaceLayout>
            <div className="mb-12">
                <Link href="/my-garage" className="text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center gap-2 mb-4 group">
                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Back to Garage
                </Link>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">AI Resale Consultant</h1>
                <p className="text-lg text-slate-500 font-medium">Maximize your asset value through blockchain-verified trust.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Insight Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#0052FF] text-white p-10 rounded-[3rem] shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8">
                            <Zap className="w-12 h-12 text-white/20 animate-pulse" />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                                <Target className="w-4 h-4" />
                                Optimal Sell Window
                            </div>
                            <h2 className="text-4xl font-black mb-4 leading-tight">
                                Market Peak Detected:<br />February - May 2026
                            </h2>
                            <p className="text-blue-100 text-lg font-medium max-w-lg mb-8">
                                Your vehicle has reached its maximum trust premium. Selling now could yield ₩2,100,000 more than regional averages.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/my-garage" className="bg-white text-[#0052FF] px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
                                    Register for Sale
                                </Link>
                                <Link href="/trade-in" className="bg-white/10 hover:bg-white/20 py-4 px-8 rounded-2xl text-white font-black text-sm transition-all border border-white/10">
                                    Explore Trade-in
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-blue-500" />
                            Value Forecast (12 Months)
                        </h3>
                        <div className="flex items-end justify-between h-48 gap-4 px-4">
                            {forecastData.map((item, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4">
                                    <div
                                        className={`w-full rounded-2xl transition-all duration-1000 relative group
                      ${item.status === 'PEAK' ? 'bg-[#0052FF]' : item.status === 'STEEP' ? 'bg-rose-500' : 'bg-slate-200'}
                    `}
                                        style={{ height: `${(item.value / 4520) * 100}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-bold">₩{item.value}만</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.date}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-[11px] text-slate-500 leading-relaxed">
                            "AI analyzes recent genuine-part service records and market momentum. A steep decline is expected after August 2026 due to the next major battery audit window."
                        </div>
                    </div>
                </div>

                {/* Sidebar Insights */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Trust Premium</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-600">Defense Bonus</span>
                                <span className="text-lg font-black text-emerald-500">+₩185만</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-emerald-500" />
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                Your consistent records at <span className="text-blue-500 font-bold">Master-grade shops</span> have preserved more value than 85% of similar models.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-black mb-2">Immutable Certificate</h3>
                        <p className="text-slate-400 text-xs leading-relaxed mb-6">
                            Your vehicle's 'Digital Passport' is fully synced with the latest AI appraisal. 0xAuth proven.
                        </p>
                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                            Download PDF Report
                        </button>
                    </div>

                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Calendar className="w-6 h-6 text-slate-400" />
                        </div>
                        <h4 className="text-sm font-black text-slate-700 mb-1">Alert Setting</h4>
                        <p className="text-[10px] text-slate-400 mb-4 px-4">Get notified when market momentum shifts.</p>
                        <button className="text-[10px] font-black text-[#0052FF] uppercase hover:underline">Enable Alerts</button>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    )
}
