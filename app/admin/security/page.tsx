"use client"

import React, { useState, useEffect } from 'react'
import { ShieldCheck, ShieldAlert, Activity, Lock, Search, AlertCircle, TrendingUp, Cpu } from 'lucide-react'

export default function SecurityDashboardPage() {
    const [riskLevel, setRiskLevel] = useState<'SAFE' | 'CAUTION' | 'DANGER'>('SAFE')
    const [logs, setLogs] = useState([
        { id: 1, type: 'INFO', msg: 'Block #14892102: AI Appraisal NFT Minted (VIN: ...4567)', time: '14:22:05' },
        { id: 2, type: 'INFO', msg: 'Escrow Created: Order-8812 (Value: 45.2 ETH EQ)', time: '14:23:11' },
        { id: 3, type: 'INFO', msg: 'Partner Bank API: Trust-Tier 1 Verification Success', time: '14:24:45' },
    ])

    useEffect(() => {
        const timer = setTimeout(() => {
            setRiskLevel('CAUTION')
            setLogs(prev => [
                { id: 4, type: 'ANOMALY', msg: 'Odometer Spike Detected: VIN: ...9912 (+5,000km in 2h)', time: '14:26:12' },
                ...prev
            ])
        }, 5000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
            {/* HUD Header */}
            <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-3xl sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-8 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                            <ShieldCheck className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tighter uppercase italic">ozcar.Guardian<span className="text-blue-500">_v1.0</span></h1>
                            <div className="flex items-center gap-2 opacity-40">
                                <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Real-time Asset Monitoring</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                            <Cpu className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-mono text-slate-400">Node_Status: <span className="text-emerald-400">SYNCED</span></span>
                        </div>
                        <div className={`px-6 py-2 rounded-xl font-black text-xs tracking-widest transition-all duration-500 border
                ${riskLevel === 'SAFE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                riskLevel === 'CAUTION' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'}
             `}>
                            SYS_RISK_INDEX: {riskLevel}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-12 gap-8">
                {/* Left Stats Column */}
                <div className="col-span-3 space-y-8">
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Asset Metrics</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="opacity-50 font-bold uppercase">Total Escrow Value</span>
                                    <span className="text-blue-400 font-black">98.5% CAP</span>
                                </div>
                                <div className="text-3xl font-black tracking-tighter">₩1,248.5B</div>
                            </div>
                            <div className="pt-6 border-t border-white/5">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="opacity-50 font-bold uppercase">Active AI Appraisals</span>
                                    <span className="text-emerald-400 font-bold">+12% / 24h</span>
                                </div>
                                <div className="text-3xl font-black tracking-tighter">14,209 Units</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <TrendingUp className="w-32 h-32" />
                        </div>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Network Health</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="opacity-50 font-bold uppercase">Latent Throughput</span>
                                <span className="font-mono">12.4k TPS</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Activity Column */}
                <div className="col-span-6 space-y-8">
                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 min-h-[600px] flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black flex items-center gap-3">
                                <Activity className="w-6 h-6 text-blue-500" />
                                On-chain Activity Stream
                            </h2>
                            <div className="flex gap-2">
                                <button className="p-2 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"><Search className="w-4 h-4" /></button>
                                <button className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black rounded-lg">LIVE FEED</button>
                            </div>
                        </div>

                        <div className="space-y-3 font-mono text-[11px] overflow-y-auto">
                            {logs.map((log) => (
                                <div key={log.id} className={`p-4 rounded-xl border flex justify-between items-center transition-all animate-in slide-in-from-top-2
                      ${log.type === 'ANOMALY' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 translate-x-2' : 'bg-white/2 bg-white/2 border-white/5 text-slate-400'}
                   `}>
                                    <div className="flex items-center gap-4">
                                        <span className="opacity-30">[{log.time}]</span>
                                        <span className={log.type === 'ANOMALY' ? 'font-black' : ''}>{log.msg}</span>
                                    </div>
                                    {log.type === 'ANOMALY' && <div className="w-2 h-2 bg-current rounded-full animate-pulse" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Governance Column */}
                <div className="col-span-3 space-y-8">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 bg-gradient-to-b from-white/5 to-transparent">
                        <div className="flex items-center gap-3 mb-8">
                            <ShieldAlert className="w-8 h-8 text-rose-500" />
                            <h3 className="text-lg font-black">Threat Response</h3>
                        </div>

                        {riskLevel === 'CAUTION' && (
                            <div className="p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl mb-8 animate-in bounce-in">
                                <div className="flex items-center gap-2 text-rose-400 mb-2">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Active Incident Detected</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed font-medium mb-4">
                                    Odometer mismatch detected on VIN: <strong>...9912</strong>. Manual audit recommended.
                                </p>
                                <div className="flex flex-col gap-2">
                                    <button className="w-full py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20">
                                        Freeze Funds (Escrow Lock)
                                    </button>
                                    <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                        Dispatch Jury Audit
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Security Policy Status</h4>
                            <div className="flex items-center justify-between p-3 bg-white/2 rounded-xl text-[10px] font-bold">
                                <span className="opacity-50">Circuit Breaker</span>
                                <span className="text-emerald-400">ENABLED</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/2 rounded-xl text-[10px] font-bold">
                                <span className="opacity-50">Lender API Sync</span>
                                <span className="text-emerald-400">OPTIMAL</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/2 rounded-xl text-[10px] font-bold">
                                <span className="opacity-50">Slashing Logic</span>
                                <span className="text-amber-400">PENDING_REVIEW</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                        <Lock className="w-12 h-12 mb-6 opacity-30" />
                        <h3 className="text-xl font-black mb-2">Secure Vault</h3>
                        <p className="text-blue-100 text-[10px] font-medium leading-relaxed mb-6">
                            All administrative actions are multi-sig authorized and anchored to the Polygon Mainnet for total auditability.
                        </p>
                        <button className="w-full py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all">
                            Audit Logs ↗
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
