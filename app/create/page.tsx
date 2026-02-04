"use client";

import { useState } from "react";
import { useWeb3 } from "@/components/Web3Provider";
import { useLanguage } from "@/components/LanguageProvider";
import { useRouter } from "next/navigation";
import { Upload, Car as CarIcon, Loader2 } from "lucide-react";

export default function CreateListing() {
    const { vehicleNFT, account } = useWeb3();
    const { t } = useLanguage();
    const router = useRouter();
    const [formData, setFormData] = useState({
        make: "",
        model: "",
        year: "",
        vin: "",
        mileage: "",
        price: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicleNFT || !account) {
            alert("Please connect your wallet first.");
            return;
        }
        setLoading(true);

        try {
            const metadata = {
                name: `${formData.year} ${formData.make} ${formData.model}`,
                description: `VIN: ${formData.vin}, Mileage: ${formData.mileage}`,
                image: "ipfs://QmSimulateHash...",
                attributes: [
                    { trait_type: "Make", value: formData.make },
                    { trait_type: "Model", value: formData.model },
                    { trait_type: "Year", value: formData.year },
                    { trait_type: "VIN", value: formData.vin },
                    { trait_type: "Mileage", value: formData.mileage },
                ]
            };

            const tokenURI = JSON.stringify(metadata);

            console.log("Minting with URI:", tokenURI);
            // Explicitly set gasLimit to avoid estimation errors on local nodes
            const tx = await vehicleNFT.mintVehicle(account, tokenURI, { gasLimit: 500000 });
            console.log("Transaction sent:", tx.hash);

            // Wait for 1 confirmation
            const receipt = await tx.wait(1);
            console.log("Transaction confirmed:", receipt);

            alert(t("create.submit") + " Success!");
            router.push("/dashboard");

        } catch (error: unknown) {
            const err = error as { code?: string | number; message?: string; reason?: string };
            console.error("Minting Error:", err);
            if (err.code === "ACTION_REJECTED") {
                alert("Transaction rejected by user.");
            } else if (err.code === -32603 || err.message?.includes("Internal JSON-RPC error")) {
                alert("Wallet Error: Please reset your wallet nonce.\nMetaMask: Settings > Advanced > Clear activity tab data.");
            } else {
                alert("Error creating listing: " + (err.reason || err.message));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <CarIcon className="w-8 h-8 text-blue-500" /> {t("create.title")}
            </h1>

            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-xl space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">{t("create.make")}</label>
                        <input name="make" required onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-blue-500" placeholder="e.g. Tesla" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">{t("create.model")}</label>
                        <input name="model" required onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-blue-500" placeholder="e.g. Model 3" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">{t("create.year")}</label>
                        <input type="number" name="year" required onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-blue-500" placeholder="2024" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">{t("create.mileage")}</label>
                        <input type="number" name="mileage" required onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-blue-500" placeholder="5000" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">{t("create.vin")}</label>
                    <input name="vin" required onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-blue-500" placeholder="ABC1234567890" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">{t("create.price")}</label>
                    <input name="price" type="number" step="0.01" required onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-blue-500" placeholder="1.5" />
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full btn-primary flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <Upload className="w-4 h-4" />}
                        {loading ? t("create.minting") : t("create.submit")}
                    </button>
                </div>
            </form>
        </div>
    );
}
