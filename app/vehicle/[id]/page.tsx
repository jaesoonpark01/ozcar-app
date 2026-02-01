"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "@/components/Web3Provider";
import { useLanguage } from "@/components/LanguageProvider";
import { useParams } from "next/navigation";
import { ethers } from "ethers";
import { Shield, Truck, CheckCircle, AlertTriangle } from "lucide-react";

export default function VehicleDetail() {
    const { id } = useParams();
    const { vehicleNFT, ozcarEscrow, account } = useWeb3();
    const { t } = useLanguage();
    const [metadata, setMetadata] = useState<any>(null);
    const [owner, setOwner] = useState<string>("");
    const [escrow, setEscrow] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!vehicleNFT || !ozcarEscrow || !id) return;
        loadData();
    }, [vehicleNFT, ozcarEscrow, id, account]);

    const loadData = async () => {
        if (!vehicleNFT || !ozcarEscrow || !id) return;
        try {
            const tokenId = id as string;
            const _owner = await vehicleNFT.ownerOf(tokenId);
            setOwner(_owner);
            const uri = await vehicleNFT.tokenURI(tokenId);
            setMetadata(JSON.parse(uri));

            const count = await ozcarEscrow.nextEscrowId();
            for (let i = 0; i < count; i++) {
                const e = await ozcarEscrow.escrows(i);
                if (e.tokenId.toString() === tokenId && e.state !== 2n && e.state !== 4n) {
                    setEscrow(e);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const createEscrowWithBuyer = async () => {
        if (!vehicleNFT || !ozcarEscrow || !id) return;
        const buyerAddr = prompt("Enter Buyer Address (0x...):");
        if (!buyerAddr) return;
        const price = prompt("Enter Price in ETH:", "0.1");
        if (!price) return;

        setLoading(true);
        try {
            const txApprove = await vehicleNFT.approve(await ozcarEscrow.getAddress(), id);
            await txApprove.wait();

            const tx = await ozcarEscrow.createEscrow(
                await vehicleNFT.getAddress(),
                id,
                buyerAddr,
                ethers.parseEther(price)
            );
            await tx.wait();
            loadData();
        } catch (e: any) {
            console.error(e);
            alert("Error: " + e.message);
        } finally { setLoading(false); }
    }

    const deposit = async () => {
        if (!escrow || !ozcarEscrow) return;
        setLoading(true);
        try {
            const tx = await ozcarEscrow.deposit(escrow.escrowId, { value: escrow.price });
            await tx.wait();
            loadData();
        } catch (e: any) { console.error(e); alert(e.message); } finally { setLoading(false); }
    };

    const confirmDelivery = async () => {
        if (!escrow || !ozcarEscrow) return;
        setLoading(true);
        try {
            const tx = await ozcarEscrow.confirmDelivery(escrow.escrowId);
            await tx.wait();
            loadData();
        } catch (e: any) { console.error(e); alert(e.message); } finally { setLoading(false); }
    };

    if (!metadata) return <div className="p-10">{t("detail.loading")}</div>;

    return (
        <div className="py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
                <div className="h-64 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-gray-600">Image: {metadata.image}</span>
                </div>

                <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h1 className="text-3xl font-bold">{metadata.name}</h1>
                    <div className="grid grid-cols-2 gap-4">
                        {metadata.attributes?.map((a: any) => (
                            <div key={a.trait_type} className="bg-white/5 p-3 rounded-lg">
                                <div className="text-xs text-gray-400 uppercase">{a.trait_type}</div>
                                <div className="font-semibold">{a.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl border-blue-500/30">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="text-blue-500" /> {t("detail.status")}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <span className="text-gray-400 block text-sm">{t("detail.owner")}</span>
                            <span className="font-mono text-sm break-all">{owner}</span>
                            {account?.toLowerCase() === owner.toLowerCase() && <span className="ml-2 text-green-500 text-xs">{t("detail.you")}</span>}
                        </div>

                        {!escrow && account?.toLowerCase() === owner.toLowerCase() && (
                            <button onClick={createEscrowWithBuyer} disabled={loading} className="w-full btn-primary">
                                {loading ? t("detail.processing") : t("detail.start_escrow")}
                            </button>
                        )}

                        {escrow && (
                            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30 space-y-3">
                                <div className="flex justify-between">
                                    <span>Status</span>
                                    <span className="font-bold text-blue-400">
                                        {['AWAITING_DEPOSIT', 'AWAITING_DELIVERY', 'COMPLETE', 'DISPUTE', 'REFUNDED'][Number(escrow.state)]}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t("detail.price")}</span>
                                    <span>{ethers.formatEther(escrow.price)} ETH</span>
                                </div>

                                {Number(escrow.state) === 0 && account?.toLowerCase() === escrow.buyer.toLowerCase() && (
                                    <button onClick={deposit} disabled={loading} className="w-full btn-primary">
                                        {loading ? t("detail.depositing") : t("detail.deposit")}
                                    </button>
                                )}

                                {Number(escrow.state) === 1 && (
                                    <div className="text-center space-y-2">
                                        <p className="text-yellow-400 text-sm"><Truck className="inline w-4 h-4" /> {t("detail.transit")}</p>
                                        {account?.toLowerCase() === escrow.buyer.toLowerCase() && (
                                            <button onClick={confirmDelivery} disabled={loading} className="w-full btn-primary bg-green-600 hover:bg-green-500">
                                                {t("detail.confirm")}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {Number(escrow.state) === 2 && (
                                    <div className="text-center text-green-500 font-bold">
                                        <CheckCircle className="inline w-5 h-5" /> {t("detail.complete")}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
