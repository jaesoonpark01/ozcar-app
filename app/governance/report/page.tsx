"use client"

import React from 'react'
import MarketplaceLayout from '../../../components/layout/MarketplaceLayout'
import { BarChart, Users, ShieldCheck, Flame, Scale, Activity, Globe } from 'lucide-react'
import { useI18n } from '../../../hooks/useI18n'

export default function GovernanceReportPage() {
    const { t } = useI18n();
    const reportData = {
        trustScore: 98.5,
        disputesCount: 12,
        slashedTokens: 14500,
        recentDecisions: [
            { id: 1, title: 'Dispute-881: VIN...9912 Odometer Investigation', txHash: '0x71c...3f2', result: 'SLASHED', date: '2h ago' },
            { id: 2, title: 'Dispute-879: Seller-01 Evidence Audit', txHash: '0x82d...1a9', result: 'VERIFIED', date: '1d ago' },
            { id: 3, title: 'System-Update: Oracle Integration V1.2', txHash: '0x93e...2b0', result: 'PASSED', date: '3d ago' },
        ]
    }

    return (
        <MarketplaceLayout>
            <div className="max-w-5xl mx-auto">
                <div className="mb-16 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 text-blue-500 font-black text-xs uppercase tracking-widest mb-4">
                            <Globe className="w-4 h-4" />
                            {t('trust_badge')}
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-4 italic" dangerouslySetInnerHTML={{ __html: t('trust_title') }} />
                        <p className="text-xl text-slate-500 font-medium max-w-xl">{t('trust_desc')}</p>
                    </div>
                    <div className="hidden lg:block">
                        <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Protocol Version</p>
                            <p className="font-mono text-xl font-black text-slate-900">v2.4.0-DECENTRALIZED</p>
                        </div>
                    </div>
                </div>

                {/* Hero Trust Index */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="md:col-span-2 bg-[#0052FF] text-white p-12 rounded-[3rem] shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <ShieldCheck className="w-48 h-48" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 opacity-60">{t('trust_index_title')}</h3>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-8xl font-black italic tracking-tighter">{reportData.trustScore}%</span>
                            </div>
                            <p className="text-blue-100 text-lg font-medium max-w-md">
                                {t('trust_index_desc')}
                            </p>
                        </div>
                    </div>

                    <div className="bg-rose-500 text-white p-10 rounded-[3rem] shadow-2xl shadow-rose-500/20 flex flex-col justify-between">
                        <div>
                            <Flame className="w-12 h-12 mb-6" />
                            <h3 className="text-sm font-black uppercase tracking-widest mb-2 opacity-60">{t('trust_slashed_title')}</h3>
                            <p className="text-4xl font-black">{reportData.slashedTokens.toLocaleString()} OZC</p>
                        </div>
                        <p className="text-xs text-rose-100 font-medium leading-relaxed">
                            {t('trust_slashed_desc')}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center">
                        <Users className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                        <p className="text-2xl font-black text-slate-900">1,240</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('trust_active_jurors')}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center">
                        <Scale className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                        <p className="text-2xl font-black text-slate-900">{reportData.disputesCount}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('trust_open_disputes')}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center">
                        <Activity className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                        <p className="text-2xl font-black text-slate-900">99.98%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('trust_data_uptime')}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center">
                        <BarChart className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                        <p className="text-2xl font-black text-slate-900">0.05%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('trust_anomaly_rate')}</p>
                    </div>
                </div>

                {/* Recent Governance Decisions */}
                <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-black flex items-center gap-3">
                            <Scale className="w-6 h-6 text-slate-900" />
                            {t('trust_jury_decisions')}
                        </h2>
                        <button className="text-xs font-black text-[#0052FF] uppercase hover:underline">{t('footer_history')}</button>
                    </div>

                    <div className="space-y-4">
                        {reportData.recentDecisions.map((decision) => (
                            <div key={decision.id} className="flex justify-between items-center p-6 bg-slate-50 border border-slate-100 rounded-[2rem] group hover:bg-slate-100 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl
                         ${decision.result === 'SLASHED' ? 'bg-rose-500/10 text-rose-500' :
                                            decision.result === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-500' :
                                                'bg-blue-500/10 text-blue-500'}
                      `}>
                                        {decision.result === 'SLASHED' ? '⚖️' : decision.result === 'VERIFIED' ? '✅' : '⚙️'}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover:text-[#0052FF] transition-colors">{decision.title}</h4>
                                        <p className="text-[10px] text-slate-400 font-mono mt-1">TX: {decision.txHash} • {decision.date}</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                      ${decision.result === 'SLASHED' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                                        decision.result === 'VERIFIED' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                            'bg-blue-50 text-blue-500 border-blue-100'}
                   `}>
                                    {decision.result}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 p-12 bg-slate-900 rounded-[3.5rem] text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent" />
                    <p className="text-blue-400 font-black text-xs uppercase tracking-widest mb-4">Finality & Transparency</p>
                    <h2 className="text-4xl font-black mb-8 max-w-2xl mx-auto">Verified by Polygon Mainnet. Trusted by Banking Partners.</h2>
                    <div className="flex justify-center gap-4">
                        <button className="bg-white text-slate-900 px-10 py-4 rounded-xl font-black text-sm hover:scale-105 transition-all">
                            {t('footer_audit_log')}
                        </button>
                        <button className="bg-white/10 border border-white/10 text-white px-10 py-4 rounded-xl font-black text-sm hover:bg-white/20 transition-all">
                            {t('footer_join_dao')}
                        </button>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    )
}
