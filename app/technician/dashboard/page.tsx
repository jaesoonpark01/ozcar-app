// app/technician/dashboard/page.tsx
"use client";

import React, { useState } from 'react';
import TechnicianLayout from '../../../components/layout/TechnicianLayout';
import MaintenanceForm from '../../../components/mining/MaintenanceForm';
import { BarChart3, Users, Wrench, Settings, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export default function TechnicianDashboard() {
    const [view, setView] = useState<'WORK' | 'ANALYTICS'>('WORK');

    return (
        <TechnicianLayout title={view === 'WORK' ? "Service Operations" : "Business Intelligence"}>
            {/* View Switcher */}
            <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-2xl w-fit">
                <button
                    onClick={() => setView('WORK')}
                    className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all ${view === 'WORK' ? 'bg-white text-[#0052FF] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Live Operations
                </button>
                <button
                    onClick={() => setView('ANALYTICS')}
                    className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all ${view === 'ANALYTICS' ? 'bg-white text-[#0052FF] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Analytics Engine
                </button>
            </div>

            {view === 'WORK' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <MaintenanceForm />
                    </div>
                    <div className="space-y-6">
                        {/* Queue / Status Card */}
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Service Queue</h3>
                            <div className="space-y-4">
                                {[
                                    { id: 'OZ-702', model: 'Tesla Model 3', status: 'IN_PROGRESS' },
                                    { id: 'OZ-703', model: 'GV60 Electrified', status: 'WAITING' },
                                    { id: 'OZ-704', model: 'Ioniq 5', status: 'WAITING' }
                                ].map((job) => (
                                    <div key={job.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                        <div>
                                            <div className="text-[10px] font-black text-[#0052FF]">{job.id}</div>
                                            <div className="text-sm font-black text-slate-900">{job.model}</div>
                                        </div>
                                        <div className={`text-[9px] font-black px-2 py-1 rounded-full ${job.status === 'IN_PROGRESS' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-slate-200 text-slate-400'}`}>
                                            {job.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex justify-between mb-4">
                                <TrendingUp className="text-[#10B981] w-6 h-6" />
                                <span className="text-[10px] font-black text-[#10B981]">+12.4%</span>
                            </div>
                            <div className="text-4xl font-black text-slate-900">142</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Monthly Inspections</div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex justify-between mb-4">
                                <DollarSign className="text-[#0052FF] w-6 h-6" />
                                <span className="text-[10px] font-black text-[#0052FF]">New High</span>
                            </div>
                            <div className="text-4xl font-black text-slate-900">4,210</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Revenue Trailing OZC</div>
                        </div>
                        <div className="bg-[#0052FF] p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
                            <div className="flex justify-between mb-4">
                                <Users className="opacity-60 w-6 h-6" />
                                <span className="text-[10px] font-black opacity-60">TOP 1%</span>
                            </div>
                            <div className="text-4xl font-black">99.8</div>
                            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mt-1">Customer Satisfaction</div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-8">Asset Performance Matrix</h3>
                        <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-slate-100 pb-2">
                            {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div
                                        style={{ height: `${h}%` }}
                                        className="bg-slate-100 group-hover:bg-[#0052FF] rounded-t-lg transition-all duration-300 w-full"
                                    />
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h * 42}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Jan</span>
                            <span>Jun</span>
                            <span>Dec</span>
                        </div>
                    </div>
                </div>
            )}
        </TechnicianLayout>
    );
}
