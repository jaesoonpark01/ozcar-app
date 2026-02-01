// components/ar/IntegrityPopup.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { DepreciationReport } from './DepreciationReport';

interface MaintenanceData {
    label: string;
    metadata: {
        repair_date: string;
        technician_id: string;
        tech_reputation: number;
        severity: string;
    };
    evidence: {
        ipfs_cid: string;
        tx_hash: string;
    };
    depreciation_report?: {
        estimatedLoss: number;
        marketAvgLoss: number;
        defenseBonus: number;
        aiAttentionScore: number;
        confidenceScore: number;
        reasoning: string;
    };
}

interface Props {
    data: MaintenanceData;
    onClose: () => void;
}

export const IntegrityPopup: React.FC<Props> = ({ data, onClose }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 text-white rounded-t-3xl p-6 backdrop-blur-md animate-[slide-up_0.3s_ease-out] z-50">
            {/* 1. Trust Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_10px_#10B981]" />
                    <span className="text-sm font-bold text-[#10B981] tracking-wide">Blockchain Verified</span>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-white/10 p-1 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
            </div>

            {/* 2. Content */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-black">{data.label}</h2>
                    {data.metadata.severity === 'HIGH' && <span className="text-[10px] bg-red-500 px-2 py-0.5 rounded font-bold">ACCIDENT</span>}
                </div>
                <p className="text-slate-400 text-sm flex gap-2">
                    <span>📅 {data.metadata.repair_date}</span>
                    <span className="text-slate-600">|</span>
                    <span>🔧 {data.metadata.technician_id}</span>
                </p>
            </div>

            {/* 3. IPFS Media Viewer (Mock) */}
            <div className="relative rounded-2xl overflow-hidden mb-6 border border-white/10 bg-black/50 aspect-video group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs">
                    [IPFS Image Loaded via CID: {data.evidence.ipfs_cid.substring(0, 10)}...]
                </div>
                {/* Placeholder image for visual effect if real IPFS not loaded */}
                {/* <img src="..." /> */}
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] font-mono border border-white/20">
                    Source: IPFS
                </div>
            </div>

            {/* 4. Technician & Tech Info */}
            <Link href={`/technician/${data.metadata.technician_id}`} className="block group">
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 mb-6 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">OZ</div>
                        <div>
                            <div className="text-xs text-slate-400 group-hover:text-blue-400 transition-colors">Authorized Tech ↗</div>
                            <div className="font-bold">Ozcar Master Garage</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-400">Reputation</div>
                        <div className="font-bold text-[#10B981]">{data.metadata.tech_reputation}%</div>
                    </div>
                </div>
            </Link>

            {/* AI Asset Value Analysis */}
            {data.depreciation_report && (
                <DepreciationReport report={data.depreciation_report} />
            )}

            {/* 5. Blockchain Proof */}
            <div className="bg-[#0052FF]/10 border border-[#0052FF]/30 p-4 rounded-xl text-center">
                <p className="text-[#0052FF] text-xs font-bold mb-2">Recorded on Polygon Network (Immutable)</p>
                <button className="text-xs bg-[#0052FF] text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors w-full flex items-center justify-center gap-2">
                    <span>View TX: {data.evidence.tx_hash.substring(0, 10)}...</span>
                    <span>↗</span>
                </button>
            </div>
        </div>
    );
};
