// app/orders/[id]/page.tsx
"use client";

import React, { useState } from 'react';
import MarketplaceLayout from '../../../components/layout/MarketplaceLayout';
import {
    CheckCircle2,
    Clock,
    Truck,
    Search,
    ShieldCheck,
    Lock,
    ArrowRight,
    ExternalLink,
    DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useI18n } from '../../../hooks/useI18n';

export default function OrderTrackingPage() {
    const params = useParams();
    const orderId = params?.id as string;
    const { t } = useI18n();

    // Mock States: AWAITING_DEPOSIT, LOGISTICS, AUDIT, COMPLETED
    const [status, setStatus] = useState<'PAYMENT' | 'LOGISTICS' | 'AUDIT' | 'COMPLETED'>('LOGISTICS');

    const steps = [
        { id: 'PAYMENT', label: t('order_step_payment'), desc: 'Secure collateral placed in protocol', icon: Lock },
        { id: 'LOGISTICS', label: t('order_step_logistics'), desc: 'Vehicle transfer in progress', icon: Truck },
        { id: 'AUDIT', label: t('order_step_audit'), desc: 'Trust audit by @master_k', icon: Search },
        { id: 'COMPLETED', label: t('order_step_settlement'), desc: 'Assets & Value released', icon: DollarSign },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === status);

    return (
        <MarketplaceLayout>
            <div className="max-w-4xl mx-auto pb-20">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{t('order_portal_title')}</div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{t('order_id_title') || `Order #${orderId?.slice(0, 8)}`}</h1>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border border-emerald-100">
                        <ShieldCheck className="w-4 h-4" /> {t('order_status_secured')}
                    </div>
                </div>

                {/* 1. Progress Tracker */}
                <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm mb-10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                        <div
                            className="h-full bg-[#0052FF] transition-all duration-1000 ease-out"
                            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            const isCompleted = idx < currentStepIndex;
                            const isActive = idx === currentStepIndex;
                            const isPending = idx > currentStepIndex;

                            return (
                                <div key={step.id} className={`flex flex-col items-center text-center ${isPending ? 'opacity-30' : 'opacity-100'} transition-opacity`}>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${isActive ? 'bg-[#0052FF] text-white scale-110 shadow-xl shadow-blue-500/20' :
                                        isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest mb-1">{step.label}</h3>
                                    <p className="text-[9px] font-bold text-slate-400 max-w-[100px] leading-tight">{step.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Left: Action Card */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black mb-6">{t('order_protocol_status')}</h2>

                                {status === 'LOGISTICS' && (
                                    <div className="space-y-6">
                                        <p className="text-slate-400 font-medium text-sm leading-relaxed">
                                            {t('order_logistics_desc')}
                                        </p>
                                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black tracking-widest uppercase opacity-60">{t('order_estimated_checkin')}</div>
                                                    <div className="text-sm font-black">2026. 02. 02 (Tomorrow)</div>
                                                </div>
                                            </div>
                                            <button className="bg-white/10 hover:bg-white text-white hover:text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black transition-all">
                                                {t('order_tracker_btn')} ↗
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {status === 'AUDIT' && (
                                    <div className="space-y-6">
                                        <p className="text-slate-400 font-medium text-sm leading-relaxed italic">
                                            &quot;{t('order_audit_desc')}&quot;
                                        </p>
                                        <button
                                            onClick={() => setStatus('COMPLETED')}
                                            className="w-full bg-[#0052FF] h-14 rounded-2xl font-black text-sm hover:scale-105 transition-all"
                                        >
                                            {t('order_finalize_btn')}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#0052FF]/10 rounded-full blur-[80px]" />
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{t('order_blockchain_ledger_link')}</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                    <span className="text-xs font-bold text-slate-500">{t('order_escrow_contract')}</span>
                                    <span className="text-xs font-mono text-blue-500 hover:underline cursor-pointer">0x71c...3f2 <ExternalLink className="inline w-3 h-3" /></span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                    <span className="text-xs font-bold text-slate-500">{t('order_value_anchored')}</span>
                                    <span className="text-sm font-black text-slate-900">12,500 OZC</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Summary Column */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{t('order_asset_summary')}</h4>
                            <div className="aspect-[4/3] bg-slate-100 rounded-2xl mb-6 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1549666242-aa84da6ed498?auto=format" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-1">Tesla Model 3</h3>
                            <div className="text-xs font-bold text-slate-400 mb-6">VIN: OZCAR-KR-5678</div>

                            <hr className="mb-6 opacity-50" />

                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm">👤</div>
                                <div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase">{t('order_seller')}</div>
                                    <div className="text-xs font-bold text-slate-900">0x123...abc</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
                            <h4 className="text-[10px] font-black text-[#0052FF] uppercase tracking-widest mb-3">{t('order_support_title')}</h4>
                            <p className="text-[11px] text-[#0052FF] font-bold leading-relaxed mb-4">
                                {t('order_support_desc')}
                            </p>
                            <button className="w-full bg-[#0052FF] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">
                                {t('order_contact_jury_btn')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
