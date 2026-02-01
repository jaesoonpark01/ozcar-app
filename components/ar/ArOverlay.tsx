// components/ar/ArOverlay.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IntegrityPopup } from './IntegrityPopup';
import Link from 'next/link';
import { MiningService } from '../../services/miningService';

interface ArOverlayProps {
    vin?: string;
}

export default function ArOverlay({ vin }: ArOverlayProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [selectedPoint, setSelectedPoint] = useState<any>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [cameraReady, setCameraReady] = useState(false);
    const [historyPoints, setHistoryPoints] = useState<any[]>([]);

    useEffect(() => {
        async function fetchRealData() {
            if (vin) {
                try {
                    const records = await MiningService.getVehicleHistory(vin);
                    const mapped = records.map((record, idx) => ({
                        point_id: `PT_${idx}`,
                        category: record.type,
                        label: record.type === 'REGISTRATION' ? 'Origin Registered' : 'Maintenance Signed',
                        position: {
                            top: `${25 + (idx * 20) % 50}%`,
                            left: `${30 + (idx * 30) % 40}%`
                        },
                        metadata: {
                            severity: record.description?.toLowerCase().includes('accident') ? "HIGH" : "NONE",
                            repair_date: record.timestamp,
                            technician_id: record.technician || record.owner,
                            tech_reputation: 95
                        },
                        evidence: {
                            ipfs_cid: record.tokenUri?.substring(0, 10) + "...",
                            tx_hash: record.txHash
                        },
                        depreciation_report: record.description?.toLowerCase().includes('accident') ? {
                            estimatedLoss: 2500000,
                            marketAvgLoss: 3200000,
                            defenseBonus: 700000,
                            aiAttentionScore: 0.85,
                            confidenceScore: 98.2,
                            reasoning: "Structural integrity preserved. Genuine OEM panel replacement anchored on-chain."
                        } : undefined
                    }));
                    setHistoryPoints(mapped);
                } catch (e) {
                    console.error("Failed to fetch AR data", e);
                }
            }
        }
        fetchRealData();
    }, [vin]);

    useEffect(() => {
        async function setupCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
                    audio: false
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setCameraReady(true);
                }
            } catch (err) {
                console.error("Camera access denied", err);
            }
        }
        setupCamera();

        const timer = setTimeout(() => setIsScanning(false), 3000);
        return () => {
            clearTimeout(timer);
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
            {/* 1. Real Video Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
            />

            {/* 2. HUD Scan Line Effect */}
            {isScanning && (
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                    <div className="w-full h-[2px] bg-blue-500/50 shadow-[0_0_20px_#3b82f6] animate-[scan_3s_infinite]" />
                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                </div>
            )}

            {/* 3. AR Data Points */}
            {!isScanning && cameraReady && historyPoints.map((point) => (
                <div
                    key={point.point_id}
                    style={{ top: point.position.top, left: point.position.left }}
                    className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <button
                        onClick={() => setSelectedPoint(point)}
                        className={`group relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-500 hover:scale-125
                            ${point.metadata.severity === 'HIGH'
                                ? 'bg-red-500/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]'
                                : 'bg-[#0052FF]/40 border-[#0052FF] shadow-[0_0_15px_rgba(0,82,255,0.8)]'}
                        `}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${point.metadata.severity === 'HIGH' ? 'bg-red-500' : 'bg-white'}`} />

                        <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl">
                                <p className="text-[10px] font-black uppercase tracking-tighter opacity-50 mb-1">{point.category}</p>
                                <p className="text-sm font-black text-white">{point.label}</p>
                            </div>
                        </div>

                        <div className="absolute top-1/2 left-1/2 w-32 h-[1px] bg-gradient-to-r from-white/30 to-transparent -translate-y-1/2 origin-left rotate-45 pointer-events-none opacity-20" />
                    </button>
                </div>
            ))}

            {/* 4. Sci-Fi HUD Overlays */}
            <div className="absolute inset-x-6 top-8 flex justify-between items-start z-40 pointer-events-none">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
                    <div className={`w-2 h-2 rounded-full ${cameraReady ? 'bg-[#10B981] animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                        {isScanning ? "Analyzing VIN Structure..." : "Auditing Vehicle Registry"}
                    </span>
                </div>

                <Link href="/" className="pointer-events-auto bg-white/10 hover:bg-white/20 transition-all p-3 rounded-2xl border border-white/10 text-white">
                    ✕
                </Link>
            </div>

            <div className="absolute inset-10 border-[1px] border-white/10 rounded-[3rem] pointer-events-none">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#0052FF] rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#0052FF] rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#0052FF] rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#0052FF] rounded-br-3xl" />
            </div>

            <div className="absolute bottom-10 inset-x-10 flex justify-between items-end z-40 pointer-events-none">
                <div className="max-w-[200px] text-white space-y-2">
                    <div className="h-[2px] w-full bg-blue-500" />
                    <p className="font-mono text-[9px] opacity-40 leading-tight">
                        DATA_SOURCE: POLYGON_MAINNET<br />
                        INTEGRITY_INDEX: 99.8%<br />
                        LATENCY: 12ms
                    </p>
                </div>
                <div className="text-right text-white">
                    <h2 className="text-3xl font-black italic tracking-tighter">{vin ? 'Verified Vehicle' : 'Searching...'}</h2>
                    <p className="text-[10px] font-mono opacity-50">VIN: {vin || 'Auto-detecting'}</p>
                </div>
            </div>

            {selectedPoint && (
                <IntegrityPopup
                    data={selectedPoint}
                    onClose={() => setSelectedPoint(null)}
                />
            )}

            <style>{`
                @keyframes scan {
                    0% { transform: translateY(-300px); }
                    100% { transform: translateY(100vh); }
                }
            `}</style>
        </div>
    );
}
