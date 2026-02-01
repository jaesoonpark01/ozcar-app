// app/service/book/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import MarketplaceLayout from '../../../components/layout/MarketplaceLayout';
import { useWeb3 } from '../../../components/Web3Provider';
import { Search, MapPin, Star, ShieldCheck, Calendar, Clock, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ServiceBookingPage() {
    const { account } = useWeb3();
    const [searchQuery, setSearchQuery] = useState('');
    const [step, setStep] = useState<'SELECT_TECH' | 'BOOK_DETAIL' | 'CONFIRMED'>('SELECT_TECH');
    const [selectedTech, setSelectedTech] = useState<any>(null);

    // Mock Technicians
    const technicians = [
        { id: '1', name: "Ozcar Master Garage", address: "0x07A5...81B66d", rating: 4.9, reputation: 98, specialties: ["EV", "Battery"], price: "50 OZC", location: "Seoul, Gangnam" },
        { id: '2', name: "Precision Auto Labs", address: "0x1234...abcd", rating: 4.7, reputation: 92, specialties: ["Engine", "Transmission"], price: "40 OZC", location: "Seoul, Yongsan" },
        { id: '3', name: "EcoDrive Solutions", address: "0x5678...efgh", rating: 4.8, reputation: 95, specialties: ["Hybrid", "Diagnostics"], price: "45 OZC", location: "Gyeonggi, Pangyo" },
    ];

    const filteredTechs = technicians.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleBook = () => {
        setStep('BOOK_DETAIL');
    };

    const confirmBooking = () => {
        setStep('CONFIRMED');
    };

    return (
        <MarketplaceLayout>
            <div className="max-w-4xl mx-auto pb-20">
                {step === 'SELECT_TECH' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="mb-10">
                            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Find Your Certified Tech.</h1>
                            <p className="text-xl text-slate-500 font-medium">Connect with top-rated specialists to maintain your vehicle's digital provenance.</p>
                        </div>

                        <div className="relative mb-8">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, specialty, or location..."
                                className="w-full bg-white border border-slate-100 h-16 pl-16 pr-6 rounded-3xl shadow-sm outline-none focus:ring-2 focus:ring-[#0052FF]/10 transition-all font-bold text-slate-800"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            {filteredTechs.map(tech => (
                                <div key={tech.id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-xl hover:translate-y-[-4px] transition-all group">
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                                            🔧
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xl font-black text-slate-900">{tech.name}</h3>
                                                <div className="bg-[#10B981] text-white text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                                                    <ShieldCheck className="w-2 h-2" /> VERIFIED
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {tech.location}</span>
                                                <span className="flex items-center gap-1 text-[#0052FF]"><Star className="w-3 h-3 fill-[#0052FF]" /> {tech.rating}</span>
                                                <span>Rep: {tech.reputation}%</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {tech.specialties.map(s => (
                                                    <span key={s} className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center md:items-end gap-4 min-w-[150px]">
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center md:text-right">Est. Service Fee</div>
                                            <div className="text-2xl font-black text-slate-900">{tech.price}</div>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedTech(tech); handleBook(); }}
                                            className="bg-[#0052FF] text-white px-8 py-3 rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
                                        >
                                            Book Appointment
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'BOOK_DETAIL' && selectedTech && (
                    <div className="animate-in slide-in-from-right-8 duration-500">
                        <button onClick={() => setStep('SELECT_TECH')} className="text-slate-400 font-bold text-sm mb-8 flex items-center gap-2 hover:text-slate-600 transition-colors">
                            ← Back to Search
                        </button>

                        <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm">
                            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Schedule Inspection</h2>
                            <p className="text-slate-500 font-medium mb-12">Confirm your service details with <span className="text-[#0052FF] font-bold">{selectedTech.name}</span>.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Preferred Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input type="date" className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#0052FF]/10 text-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Preferred Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input type="time" className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#0052FF]/10 text-sm" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Selected Vehicle</h4>
                                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xl">🚘</div>
                                        <div>
                                            <div className="text-sm font-black text-slate-900 tracking-tight">Tesla Model 3</div>
                                            <div className="text-[10px] font-mono text-slate-400 uppercase">VIN: OZCAR-KR-5678</div>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-slate-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-slate-500">Service Fee</span>
                                            <span className="text-sm font-black text-slate-900">{selectedTech.price}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-500">Platform Tax</span>
                                            <span className="text-sm font-black text-[#0052FF]">FREE (Beta)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={confirmBooking}
                                className="w-full bg-[#0052FF] text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.01] transition-all"
                            >
                                Request Service
                            </button>
                        </div>
                    </div>
                )}

                {step === 'CONFIRMED' && (
                    <div className="max-w-2xl mx-auto text-center py-20 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-[#10B981] text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-xl shadow-emerald-500/20">
                            ✓
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">Booking Sent.</h1>
                        <p className="text-xl text-slate-500 font-medium mb-12">
                            The technician has been notified. Check your 'Service Portal' for real-time updates.
                        </p>

                        <div className="bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative mb-12">
                            <div className="relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-8 block">Your Authorization Code</span>
                                <div className="text-7xl font-black tracking-[0.2em] text-[#10B981]">8821</div>
                                <p className="text-xs text-slate-400 font-medium mt-8 leading-relaxed max-w-sm mx-auto">
                                    Provide this code to <span className="text-white">@{selectedTech.handle || "tech"}</span> only <span className="text-emerald-400 underline">after the service is complete</span> to authorize the blockchain entry.
                                </p>
                            </div>
                            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#10B981]/10 rounded-full blur-[80px]" />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <Link href="/my-garage" className="bg-slate-100 text-slate-900 px-10 py-4 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">
                                Back to Garage
                            </Link>
                            <Link href="/dashboard" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all">
                                Tracking Portal
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </MarketplaceLayout>
    );
}
