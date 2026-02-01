// app/explorer/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import MarketplaceLayout from '../../components/layout/MarketplaceLayout';
import { MiningService } from '../../services/miningService';
import { useSearchParams } from 'next/navigation';
import { Search, History, ExternalLink, Activity } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

interface VehicleRecord {
    type: string;
    timestamp: string;
    tokenUri: string;
    owner?: string;
    technician?: string;
    mileage?: string | number;
    description?: string;
    txHash?: string;
    vin?: string;
}

function ExplorerContent() {
    const searchParams = useSearchParams();
    const { t } = useI18n();
    const initialVin = searchParams.get('vin') || '';

    const [vin, setVin] = useState(initialVin);
    const [history, setHistory] = useState<VehicleRecord[]>([]);
    const [status, setStatus] = useState<'IDLE' | 'SEARCHING' | 'FOUND' | 'NOT_FOUND'>('IDLE');

    useEffect(() => {
        if (initialVin) {
            performSearch(initialVin);
        }
    }, [initialVin]);

    const performSearch = async (targetVin: string) => {
        if (!targetVin) return;
        try {
            setStatus('SEARCHING');
            const records = await MiningService.getVehicleHistory(targetVin);

            if (records && records.length > 0) {
                setHistory(records);
                setStatus('FOUND');
            } else {
                setHistory([]);
                setStatus('NOT_FOUND');
            }
        } catch (error) {
            console.error(error);
            setStatus('IDLE');
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(vin);
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight" dangerouslySetInnerHTML={{ __html: t('explorer_title') }} />
                <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto">{t('explorer_desc')}</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border border-slate-100 mb-16 flex items-center pr-4 ring-8 ring-slate-50">
                <form onSubmit={handleSearch} className="flex-1 flex items-center">
                    <div className="pl-6 pr-4">
                        <Search className="w-6 h-6 text-[#0052FF]" />
                    </div>
                    <input
                        value={vin}
                        onChange={e => setVin(e.target.value)}
                        className="flex-1 py-5 bg-transparent border-none outline-none font-mono font-bold text-xl text-slate-900 placeholder:text-slate-300 placeholder:font-sans"
                        placeholder={t('explorer_placeholder')}
                    />
                    <button
                        type="submit"
                        className="bg-[#0052FF] text-white px-10 py-4 rounded-[1.5rem] font-black text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-95"
                    >
                        {t('explorer_audit')}
                    </button>
                </form>
            </div>

            {status === 'SEARCHING' && (
                <div className="text-center py-20 flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-[#0052FF] border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-slate-400 text-lg">{t('explorer_searching')}</p>
                </div>
            )}

            {status === 'NOT_FOUND' && (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">😶</div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">{t('explorer_not_found')}</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">{t('explorer_not_found_desc').replace('{vin}', vin)}</p>
                </div>
            )}

            {status === 'FOUND' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center gap-4 mb-4">
                        <History className="w-6 h-6 text-slate-400" />
                        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{t('explorer_record_title')}</h2>
                    </div>

                    <div className="relative border-l-4 border-slate-100 ml-6 pl-10 space-y-12 pb-10">
                        {history.map((record, idx) => (
                            <div key={idx} className="relative">
                                {/* Timeline Node */}
                                <div className={`absolute -left-[54px] top-4 w-10 h-10 rounded-full bg-white border-4 ${record.type === 'REGISTRATION' ? 'border-[#0052FF]' : 'border-[#10B981]'} shadow-xl flex items-center justify-center`}>
                                    {record.type === 'REGISTRATION' ? (
                                        <Activity className="w-4 h-4 text-[#0052FF]" />
                                    ) : (
                                        <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full animate-pulse" />
                                    )}
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${record.type === 'REGISTRATION' ? 'bg-[#0052FF]/5' : 'bg-[#10B981]/5'} rounded-full -mr-16 -mt-16`} />

                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className={`text-[10px] font-black ${record.type === 'REGISTRATION' ? 'bg-[#0052FF]/10 text-[#0052FF]' : 'bg-[#10B981]/10 text-[#10B981]'} px-3 py-1 rounded-full inline-block mb-3 uppercase tracking-wider`}>
                                                {record.type}
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 leading-tight">
                                                {record.type === 'REGISTRATION' ? t('explorer_identity_minted') : t('explorer_maintenance_signed')}
                                            </h3>
                                            <div className="text-sm text-slate-400 font-bold mt-2 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-slate-200 rounded-full" />
                                                {record.timestamp}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 font-sans">{t('explorer_verification_cid')}</div>
                                            <div className="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded select-all truncate max-w-[120px]">
                                                {record.tokenUri ? record.tokenUri.substring(0, 15) + '...' : 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-slate-200 transition-colors">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('explorer_authority_provider')}</div>
                                            <div className="text-xs font-mono text-slate-600 break-all leading-relaxed font-bold">
                                                {record.owner || record.technician}
                                            </div>
                                        </div>
                                        {record.mileage && (
                                            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col justify-center">
                                                <div className="text-[10px] font-black text-[#0052FF] uppercase tracking-widest mb-1">{t('explorer_authenticated_mileage')}</div>
                                                <div className="text-3xl font-black text-[#0052FF] tracking-tighter">
                                                    {Number(record.mileage).toLocaleString()} <span className="text-sm">KM</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {record.description && (
                                        <div className="mb-8 p-6 bg-slate-50 rounded-2xl text-slate-600 font-medium italic border-l-4 border-slate-200">
                                            &quot;{record.description}&quot;
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-xs font-bold pt-4 border-t border-slate-50 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-[#10B981] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                            {t('explorer_verified')}
                                        </div>
                                        {record.txHash && record.txHash !== 'Internal Record' ? (
                                            <a
                                                href={`https://polygonscan.com/tx/${record.txHash}`}
                                                target="_blank"
                                                className="text-[#0052FF] hover:bg-blue-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                                            >
                                                {t('explorer_audit_hash')} <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <div className="text-slate-300 font-mono tracking-tighter">{t('explorer_layer2_anchored')}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ExplorerPage() {
    return (
        <MarketplaceLayout>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-16 h-16 border-4 border-[#0052FF] border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                <ExplorerContent />
            </Suspense>
        </MarketplaceLayout>
    );
}
