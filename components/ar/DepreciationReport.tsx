"use client"

import React from 'react'
import { TrendingDown, ShieldCheck, Zap, Info } from 'lucide-react'

interface DepreciationReportProps {
    report: {
        estimatedLoss: number
        marketAvgLoss: number
        defenseBonus: number
        aiAttentionScore: number
        confidenceScore: number
        reasoning: string
    }
}

export const DepreciationReport: React.FC<DepreciationReportProps> = ({ report }) => {
    const defensePercentage = (report.defenseBonus / report.marketAvgLoss) * 100

    return (
        <div className="mt-6 p-6 bg-slate-900/50 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
                <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-emerald-500/20">
                    <Zap className="w-3 h-3 fill-current" />
                    AI CONFIDENCE {report.confidenceScore}%
                </div>
            </div>

            <div className="flex items-center gap-2 mb-6 text-slate-400">
                <TrendingDown className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">AI Asset Value Analysis</h3>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-black text-rose-500 tracking-tight">
                    -₩{(report.estimatedLoss / 10000).toLocaleString()}만
                </span>
                <span className="text-sm font-medium text-slate-500">Value Adjustment</span>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2.5">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                            Trust Defense Bonus
                        </span>
                        <span className="text-xs font-bold text-blue-400">
                            +₩{report.defenseBonus.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000"
                            style={{ width: `${defensePercentage}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                        Genuine parts and certified shop records protected {defensePercentage.toFixed(1)}% of typical market depreciation.
                    </p>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <div className="flex gap-3">
                        <div className="mt-1">
                            <Info className="w-4 h-4 text-slate-500" />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed italic">
                            "{report.reasoning}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
