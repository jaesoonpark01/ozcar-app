// app/my-orders/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import MarketplaceLayout from '../../components/layout/MarketplaceLayout';
import { useWeb3 } from '../../components/Web3Provider';
import { useI18n } from '../../hooks/useI18n';
import { ethers } from 'ethers';

interface Order {
    id: number;
    car: string;
    price: string;
    state: number; // enum State { AWAITING_DEPOSIT, AWAITING_DELIVERY, COMPLETE... }
    seller: string;
}

export default function MyOrdersPage() {
    const { account, ozcarEscrow } = useWeb3();
    const { t, lang } = useI18n();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMap, setStatusMap] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        async function fetchMyOrders() {
            if (!ozcarEscrow || !account) {
                setIsLoading(false);
                return;
            }
            try {
                // 'buyer' is not indexed in the contract, so we must fetch all and filter in memory
                const filter = ozcarEscrow.filters.EscrowCreated();
                const allEvents = await ozcarEscrow.queryFilter(filter, 0, 'latest');

                // Filter for events where current user is buyer
                const events = allEvents.filter(e => {
                    const args = (e as unknown as { args: { buyer: string } }).args;
                    return args.buyer.toLowerCase() === account.toLowerCase();
                });

                const myOrders: Order[] = [];
                for (const event of events) {
                    const id = Number((event as unknown as { args: { escrowId: string } }).args.escrowId);
                    const escrowData = await ozcarEscrow.escrows(id);

                    myOrders.push({
                        id,
                        car: "Vehicle NFT #" + escrowData.tokenId,
                        price: ethers.formatEther(escrowData.price),
                        state: Number(escrowData.state),
                        seller: escrowData.seller
                    });
                }
                setOrders(myOrders);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMyOrders();
    }, [ozcarEscrow, account]);

    const confirmDelivery = async (escrowId: number) => {
        if (!ozcarEscrow) return;
        try {
            setStatusMap({ ...statusMap, [escrowId]: 'CONFIRMING' });
            const tx = await ozcarEscrow.confirmDelivery(escrowId);
            await tx.wait();

            setOrders(orders.map(o => o.id === escrowId ? { ...o, state: 2 } : o)); // 2 = COMPLETE
            setStatusMap({ ...statusMap, [escrowId]: 'COMPLETE' });
        } catch (e) {
            console.error(e);
            alert(t('error_tx_failed'));
            setStatusMap({ ...statusMap, [escrowId]: 'IDLE' });
        }
    };

    const getStateLabel = (state: number) => {
        switch (state) {
            case 0: return { label: t('order_status_awaiting_deposit'), color: "bg-blue-100 text-blue-700" };
            case 1: return { label: t('order_status_locked'), color: "bg-yellow-100 text-yellow-800" };
            case 2: return { label: t('order_status_complete'), color: "bg-green-100 text-green-700" };
            case 3: return { label: t('order_status_dispute'), color: "bg-red-100 text-red-700" };
            case 4: return { label: t('order_status_refunded'), color: "bg-slate-100 text-slate-700" };
            default: return { label: t('order_status_unknown'), color: "bg-slate-100" };
        }
    };

    return (
        <MarketplaceLayout>
            <div className="mb-12">
                <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">{t('orders_title')}</h1>
                <p className="text-lg text-slate-500 font-medium">{t('orders_desc')}</p>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-3xl animate-pulse" />)}
                </div>
            ) : orders.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {orders.map(order => {
                        const { label, color } = getStateLabel(order.state);
                        return (
                            <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 group hover:shadow-xl transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">📦</div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('order_id_title').replace('{id}', order.id.toString())}</span>
                                            <span className={`${color} text-[10px] font-black px-2 py-0.5 rounded-full uppercase`}>{label}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900">{order.car}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{t('order_seller')}: <span className="font-mono">{order.seller.substring(0, 10)}...</span> • <span className="text-[#0052FF] font-black">{order.price} OZC</span></p>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto">
                                    {order.state === 1 && (
                                        <button
                                            onClick={() => confirmDelivery(order.id)}
                                            disabled={statusMap[order.id] === 'CONFIRMING'}
                                            className="w-full md:w-auto bg-[#0052FF] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {statusMap[order.id] === 'CONFIRMING' ? t('order_processing') : t('order_confirm_delivery_btn')}
                                        </button>
                                    )}

                                    {order.state === 2 && (
                                        <div className="flex items-center gap-3 text-[#10B981] font-black">
                                            <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">✓</div>
                                            {t('order_status_complete')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center">
                    <div className="text-6xl mb-6 opacity-30">📦</div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">{t('order_empty_title')}</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">{t('order_empty_desc')}</p>
                </div>
            )}
        </MarketplaceLayout>
    );
}

