// app/vehicle/ar-demo/page.tsx
"use client";

import React, { Suspense } from 'react';
import ArOverlay from '../../../components/ar/ArOverlay';
import { useSearchParams } from 'next/navigation';

function ArContent() {
    const searchParams = useSearchParams();
    const vin = searchParams.get('vin') || '';

    return (
        <div className="h-screen w-full bg-black">
            <ArOverlay vin={vin} />
        </div>
    );
}

export default function ArDemoPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-white font-black">Initializing Lens...</div>}>
            <ArContent />
        </Suspense>
    );
}
