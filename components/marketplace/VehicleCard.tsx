//  omponents/marketplace/VehicleCard.tsx 
"use client";

import React from 'react';
import Link from 'next/link';

interface VehicleProps {
    id: string; // Token ID
    image: string;
    model: string;
    price: string;
    mileage: number;
    year: number;
    location: string;
    isCertified: boolean;
}

const VehicleCard: React.FC<{ vehicle: VehicleProps }> = ({ vehicle }) => {
    return (
        <Link href={`/marketplace/${vehicle.id}`} className="group">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group-hover:-translate-y-1">
                {/* Image Area */}
                <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
                    <img
                        src={vehicle.image}
                        alt={vehicle.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {vehicle.isCertified && (
                            <div className="bg-[#10B981] text-white text-[10px] font-black px-2 py-1 rounded-md border border-emerald-400/30 flex items-center gap-1 shadow-lg shadow-emerald-500/20">
                                <span>💎</span> CERTIFIED
                            </div>
                        )}
                        <div className="bg-slate-900/80 backdrop-blur text-white text-[9px] font-black px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 shadow-xl">
                            <span>📊</span> AI 98/100
                        </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-[#0052FF] text-white text-xs font-black px-4 py-2 rounded-xl shadow-xl shadow-blue-500/20 border border-blue-400/30">
                        {vehicle.price} OZC
                    </div>
                </div>

                {/* Info Area */}
                <div className="p-5">
                    <h3 className="text-lg font-black text-slate-800 mb-1">{vehicle.model}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-4">
                        <span>{vehicle.year}</span>
                        <span>•</span>
                        <span>{vehicle.mileage.toLocaleString()} km</span>
                        <span>•</span>
                        <span>{vehicle.location}</span>
                    </div>

                    <div className="w-full bg-slate-50 text-slate-400 py-3 rounded-xl font-bold text-center text-sm group-hover:bg-[#0052FF] group-hover:text-white transition-colors">
                        View Details
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VehicleCard;
