// app/sell/page.tsx
"use client";

import React, { useState } from 'react';
import MarketplaceLayout from '../../components/layout/MarketplaceLayout';
import { useWeb3 } from '../../components/Web3Provider';
import { ShieldCheck, Zap, Sparkles, Car, Cpu, Database } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '../../hooks/useI18n';

export default function SellPage() {
    const { account, connectWallet, vehicleNFT } = useWeb3();
    const { t } = useI18n();
    const [vin, setVin] = useState('');
    const [model, setModel] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'MINTING' | 'SUCCESS'>('IDLE');

    const handleMint = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!account) return connectWallet();
        if (!vehicleNFT) {
            alert(t('error_node_not_initialized') || "Protocol Node not initialized.");
            return;
        }

        try {
            setStatus('MINTING');
            const metadata = {
                name: model,
                vin: vin,
                image: "https://images.unsplash.com/photo-1549666242-aa84da6ed498?auto=format"
            };
            const tokenURI = JSON.stringify(metadata);

            const tx = await vehicleNFT.registerVehicle(account, vin, tokenURI);
            await tx.wait();

            setStatus('SUCCESS');
        } catch (error) {
            console.error(error);
            alert(t('error_tx_failed') || "Transaction failed. Peer node rejected the block.");
            setStatus('IDLE');
        }
    };

    if (status === 'SUCCESS') {
        return (
            <MarketplaceLayout>
                <div className="max-w-3xl mx-auto text-center py-32 animate-in zoom-in-95 duration-700">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-10 shadow-xl shadow-emerald-500/20">
                        ✨
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">{t('sell_success_title')}</h1>
                    <p className="text-xl text-slate-400 font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                        {t('sell_success_desc').replace('{model}', model)}
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link href="/my-garage" className="bg-[#0052FF] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 hover:scale-105 transition-all">
                            {t('sell_view_garage')}
                        </Link>
                        <button
                            onClick={() => { setStatus('IDLE'); setVin(''); setModel(''); }}
                            className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                        >
                            {t('sell_register_another')}
                        </button>
                    </div>
                </div>
            </MarketplaceLayout>
        );
    }

    return (
        <MarketplaceLayout>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center py-10">
                <div className="space-y-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Cpu className="w-5 h-5 text-[#0052FF]" />
                            <span className="text-[10px] font-black text-[#0052FF] uppercase tracking-[0.3em]">Lifecycle Protocol v1.0</span>
                        </div>
                        <h1 className="text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]" dangerouslySetInnerHTML={{ __html: t('sell_title') }} />
                        <p className="text-xl text-slate-500 font-medium leading-relaxed">
                            {t('sell_desc')}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-50 text-[#0052FF] rounded-lg flex items-center justify-center shrink-0">
                                <Database className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{t('feat_tech_trust')}</h4>
                                <p className="text-sm text-slate-500">{t('feat_tech_trust_desc')}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{t('feat_econ_trust')}</h4>
                                <p className="text-sm text-slate-500">{t('feat_econ_trust_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-slate-100 relative">
                    <form onSubmit={handleMint} className="space-y-8 relative z-10">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center lg:text-left">{t('sell_vin_label')}</label>
                                <input
                                    required
                                    value={vin}
                                    onChange={e => setVin(e.target.value.toUpperCase())}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 font-mono font-black text-2xl text-[#0052FF] outline-none focus:border-[#0052FF] focus:bg-white transition-all placeholder:opacity-20"
                                    placeholder="OZCAR-KR-5678"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center lg:text-left">{t('sell_model_label')}</label>
                                <input
                                    required
                                    value={model}
                                    onChange={e => setModel(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 font-black text-xl text-slate-900 outline-none focus:border-[#0052FF] focus:bg-white transition-all placeholder:opacity-20"
                                    placeholder="Tesla Model 3 / Genesis GV60"
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                            </div>
                            <p className="text-xs text-slate-500 font-bold leading-tight">
                                This action will cost a small gas fee. <br />
                                <span className="text-[#0052FF]">Network: Polygon Mainnet Simulation</span>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={status !== 'IDLE' || !vin || !model}
                            className={`w-full h-20 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl ${status === 'IDLE'
                                ? 'bg-slate-950 text-white hover:bg-[#0052FF] shadow-black/10'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {status === 'IDLE' ? (
                                <>{t('sell_mint_btn')} <Zap className="w-5 h-5" /></>
                            ) : (
                                <>{t('sell_minting')} <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /></>
                            )}
                        </button>
                    </form>

                    {/* Visual Decor */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0052FF]/5 rounded-full blur-[60px] pointer-events-none" />
                </div>
            </div>
        </MarketplaceLayout>
    );
}
