"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "@/components/Web3Provider";
import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";
import { Car } from "lucide-react";

export default function Market() {
    const { vehicleNFT } = useWeb3();
    const { t } = useLanguage();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            if (!vehicleNFT) {
                setLoading(false);
                return;
            }

            try {
                const fetched = [];
                for (let i = 0; i < 5; i++) {
                    try {
                        const owner = await vehicleNFT.ownerOf(i);
                        const uri = await vehicleNFT.tokenURI(i);

                        let metadata = { name: "Unknown", description: "No data", attributes: [] };
                        try {
                            metadata = JSON.parse(uri);
                        } catch (e) {
                        }

                        fetched.push({
                            tokenId: i,
                            owner,
                            ...metadata
                        });
                    } catch (e) {
                        break;
                    }
                }
                setVehicles(fetched);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [vehicleNFT]);

    return (
        <div className="py-10">
            <h1 className="text-3xl font-bold mb-8">{t("market.title")}</h1>

            {loading ? (
                <p>{t("market.loading")}</p>
            ) : vehicles.length === 0 ? (
                <p className="text-gray-400">{t("market.empty")}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((v) => (
                        <div key={v.tokenId} className="glass-panel p-0 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
                            <div className="h-48 bg-gray-800 flex items-center justify-center">
                                <Car className="w-16 h-16 text-gray-600" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-1">{v.name}</h3>
                                <p className="text-sm text-gray-400 mb-4">{v.description}</p>

                                <div className="flex justify-between items-center">
                                    <span className="text-xs px-2 py-1 bg-blue-900/40 text-blue-300 rounded border border-blue-500/20">
                                        ID: #{v.tokenId}
                                    </span>
                                    <Link href={`/vehicle/${v.tokenId}`} className="text-blue-400 hover:text-white text-sm font-medium">
                                        {t("market.view")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
