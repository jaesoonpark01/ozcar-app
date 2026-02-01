"use client";

import Link from "next/link";
import { useWeb3 } from "./Web3Provider";
import { useLanguage } from "./LanguageProvider";
import { Car, Wallet, ShieldCheck, Globe } from "lucide-react";

export default function Navbar() {
    const { account, connectWallet } = useWeb3();
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "kr" : "en");
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-blue-500" />
                        <Link href="/" className="text-xl font-bold tracking-tight text-white">
                            ozcar <span className="text-blue-500 text-sm font-light">PRO</span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link href="/market" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                {t("nav.market")}
                            </Link>
                            <Link href="/create" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                {t("nav.sell")}
                            </Link>
                            <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                {t("nav.dashboard")}
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={toggleLanguage} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-mono px-3 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <Globe className="w-4 h-4" />
                            {language.toUpperCase()}
                        </button>

                        <button
                            onClick={connectWallet}
                            className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-2 rounded-full border border-blue-500/50 transition-all font-medium text-sm"
                        >
                            <Wallet className="w-4 h-4" />
                            {account ? `${account.substring(0, 6)}...${account.substring(38)}` : t("nav.connect")}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
