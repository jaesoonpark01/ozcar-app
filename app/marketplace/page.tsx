// app/marketplace/page.tsx
"use client";

import React from 'react';
import MarketplaceLayout from '../../components/layout/MarketplaceLayout';
import VehicleCard from '../../components/marketplace/VehicleCard';
import { useI18n } from '../../hooks/useI18n';

// Mock Data for MVP
const MOCK_VEHICLES = [
    {
        id: "1",
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
        model: "Tesla Model 3 Long Range",
        price: "35,000",
        mileage: 12000,
        year: 2023,
        location: "Seoul, Gangnam",
        isCertified: true,
    },
    {
        id: "2",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800",
        model: "Porsche Taycan 4S",
        price: "85,000",
        mileage: 5400,
        year: 2022,
        location: "Busan, Haeundae",
        isCertified: true,
    },
    {
        id: "3",
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=800",
        model: "Genesis GV60 Performance",
        price: "42,000",
        mileage: 21000,
        year: 2022,
        location: "Seoul, Yongsan",
        isCertified: false,
    },
    {
        id: "4",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
        model: "Hyundai Ioniq 5 Prestige",
        price: "38,000",
        mileage: 15000,
        year: 2023,
        location: "Gyeonggi, Pangyo",
        isCertified: true,
    }
];

export default function MarketplacePage() {
    const { t } = useI18n();
    return (
        <MarketplaceLayout>
            <div className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 mb-2" dangerouslySetInnerHTML={{ __html: t('market_title') }} />
                <p className="text-slate-500 font-medium text-lg">{t('market_desc')}</p>
            </div>

            {/* Filters (Visual Only for MVP) */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { key: 'All', label: t('market_filter_all') },
                    { key: 'Certified', label: t('market_filter_certified') },
                    { key: 'Electric', label: t('market_filter_electric') },
                    { key: 'Hybrid', label: t('market_filter_hybrid') },
                    { key: 'Sports', label: t('market_filter_sports') },
                    { key: 'SUV', label: t('market_filter_suv') }
                ].map((filter, idx) => (
                    <button
                        key={filter.key}
                        className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${idx === 0 ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MOCK_VEHICLES.map(v => (
                    <VehicleCard key={v.id} vehicle={v} />
                ))}
            </div>
        </MarketplaceLayout>
    );
}
