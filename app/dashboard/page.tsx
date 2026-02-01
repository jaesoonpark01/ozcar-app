"use client";

import { useWeb3 } from "@/components/Web3Provider";
import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";
import { PlusCircle, ShoppingBag } from "lucide-react";

export default function Dashboard() {
    const { account } = useWeb3();
    const { t } = useLanguage();

    return (
        <div className="py-10">
            <h1 className="text-3xl font-bold mb-8">{t("dash.title")}</h1>

            {!account ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl">
                    <h2 className="text-xl text-gray-400">{t("dash.connect")}</h2>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{t("dash.vehicles")}</h2>
                            <Link href="/create" className="btn-primary text-xs flex items-center gap-1">
                                <PlusCircle className="w-3 h-3" /> {t("dash.new")}
                            </Link>
                        </div>
                        <div className="text-gray-400 text-sm">
                            {t("dash.no_vehicles")}
                            <br />
                            <Link href="/market" className="text-blue-400 underline">{t("dash.market_link")}</Link> {t("dash.market_desc")}
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" /> {t("dash.escrows")}
                            </h2>
                        </div>
                        <div className="text-gray-400 text-sm">
                            (Transactions where you are Buyer or Seller.)
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
