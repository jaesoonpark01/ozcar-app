// components/mining/MaintenanceForm.tsx
"use client";

import { useState } from 'react';
import { MiningService } from '../../services/miningService';
import { useWeb3 } from '../../components/Web3Provider';

export default function MaintenanceForm() {
    const { account, refreshData } = useWeb3();
    const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'MINING' | 'SUCCESS'>('IDLE');
    const [vin, setVin] = useState('');
    const [mileage, setMileage] = useState('');
    const [ownerSecret, setOwnerSecret] = useState('');
    const [isClaiming, setIsClaiming] = useState(false);

    const handleMining = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vin || !mileage || !ownerSecret) {
            alert("Please fill in all fields");
            return;
        }

        setStatus('UPLOADING');
        try {
            // 1. IPFS Upload Simulation
            const mockFile = new File(["foo"], "foo.txt", { type: "text/plain" });
            const ipfsHash = await MiningService.uploadToIPFS(mockFile);

            // 2. Blockchain Mining
            setStatus('MINING');
            await MiningService.recordMaintenance({
                vin,
                mileage,
                ipfsHash,
                ownerSecret
            });

            await refreshData();
            setStatus('SUCCESS');
        } catch (error) {
            console.error(error);
            alert("Mining failed. Please try again.");
            setStatus('IDLE');
        }
    };

    const resetForm = () => {
        setStatus('IDLE');
        setVin('');
        setMileage('');
        setOwnerSecret('');
    };

    if (status === 'SUCCESS') {
        const onClaim = async () => {
            if (!account) return;
            setIsClaiming(true);
            try {
                await MiningService.claimReward(account);
                await refreshData();
                alert("15 OZC successfully claimed!");
                resetForm();
            } catch (error) {
                console.error(error);
                alert("Claim failed.");
            } finally {
                setIsClaiming(false);
            }
        };

        return (
            <div className="bg-white p-8 rounded-3xl text-center shadow-2xl animate-in fade-in zoom-in duration-300 border-2 border-[#10B981]/10">
                <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-2xl font-black mb-2 text-[#1E293B]">Maintenance Logged!</h3>
                <p className="text-slate-500 mb-8 font-medium">Data anchored & reputation pending.</p>

                <div className="bg-slate-50 p-4 rounded-2xl text-xs font-mono break-all mb-8 border border-slate-100 text-slate-400">
                    Proof: {vin.substring(0, 10)}... anchored
                </div>

                <button
                    onClick={onClaim}
                    disabled={isClaiming}
                    className="w-full bg-[#0052FF] text-white py-4 rounded-xl font-bold text-lg shadow-blue-200 shadow-xl hover:scale-[1.02] transition-transform disabled:bg-slate-300"
                >
                    {isClaiming ? "Processing Reward..." : "+ 15 OZC & Claim Reputation"}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleMining} className="space-y-6">
            <section className="bg-white p-6 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-slate-100">
                <label className="block text-sm font-bold mb-3 text-slate-400 uppercase tracking-wider">Vehicle VIN</label>
                <div className="flex gap-3">
                    <input
                        className="flex-1 bg-slate-50 border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#0052FF]/20 font-bold text-[#1E293B] tracking-widest placeholder:font-normal placeholder:tracking-normal"
                        placeholder="Scan or Type VIN"
                        value={vin}
                        onChange={(e) => setVin(e.target.value)}
                    />
                    <button type="button" className="bg-slate-800 text-white px-5 rounded-xl font-bold hover:bg-slate-700 transition-colors">
                        Scan
                    </button>
                </div>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-red-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">SECURITY</div>
                <label className="block text-sm font-bold mb-3 text-red-400 uppercase tracking-wider">Owner Authorization Code (Double-Lock)</label>
                <input
                    type="password"
                    className="w-full bg-red-50/50 border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-500/20 font-bold text-slate-800 tracking-widest"
                    placeholder="••••"
                    maxLength={4}
                    value={ownerSecret}
                    onChange={(e) => setOwnerSecret(e.target.value)}
                />
                <p className="text-[11px] text-slate-400 mt-2">* Obtain this code from the vehicle owner to authorize this record on-chain. This ensures data is only mined with permission.</p>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-slate-100 space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-3 text-[#0052FF] uppercase tracking-wider">Current Mileage (km)</label>
                    <input
                        type="number"
                        className="w-full bg-slate-50 border-none rounded-xl p-4 font-black text-2xl text-[#1E293B] outline-none focus:ring-2 focus:ring-[#0052FF]/20"
                        placeholder="0"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-3 text-slate-400 uppercase tracking-wider">Evidence Photos</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-[#0052FF] hover:bg-blue-50 transition-colors cursor-pointer group">
                            <span className="text-3xl text-slate-300 group-hover:text-[#0052FF] transition-colors">+</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-2 group-hover:text-[#0052FF]">Before</span>
                        </div>
                        <div className="aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-[#0052FF] hover:bg-blue-50 transition-colors cursor-pointer group">
                            <span className="text-3xl text-slate-300 group-hover:text-[#0052FF] transition-colors">+</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-2 group-hover:text-[#0052FF]">After</span>
                        </div>
                    </div>
                </div>
            </section>

            <button
                type="submit"
                disabled={status !== 'IDLE'}
                className="w-full bg-[#0052FF] text-white py-5 rounded-2xl font-black text-xl shadow-[#0052FF]/20 shadow-xl disabled:bg-slate-300 disabled:shadow-none transition-all active:scale-95"
            >
                {status === 'IDLE' && "Record & Mine ⛏️"}
                {status === 'UPLOADING' && "Validating Media..."}
                {status === 'MINING' && "Anchoring to Chain..."}
            </button>
        </form>
    );
}
