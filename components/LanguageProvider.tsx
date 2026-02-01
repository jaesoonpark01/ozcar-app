"use client";

import React, { createContext, useContext, useState } from "react";

type Language = "en" | "kr";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    en: {
        "nav.market": "Marketplace",
        "nav.sell": "Sell Car",
        "nav.dashboard": "Dashboard",
        "nav.connect": "Connect Storage",
        "hero.title1": "Trust",
        "hero.title2": "Protocol",
        "hero.subtitle": "The world's first decentralized used car marketplace. Where code is law, and reputation is currency.",
        "hero.cta.list": "List Your Vehicle",
        "hero.cta.browse": "Browse Inventory",
        "feat.history.title": "Immutable History",
        "feat.history.desc": "Every repair, accident, and mileage update is anchored to the blockchain. No rollbacks, no lies.",
        "feat.nft.title": "NFT Identity",
        "feat.nft.desc": "Each vehicle is a unique NFT (ERC-721). Ownership transfer is instant and cryptographic.",
        "feat.escrow.title": "Secure Escrow",
        "feat.escrow.desc": "Funds are held in a Smart Contract until you confirm delivery. Zero risk of fraud.",

        // Create Page
        "create.title": "Register Vehicle",
        "create.make": "Make",
        "create.model": "Model",
        "create.year": "Year",
        "create.mileage": "Mileage (km)",
        "create.vin": "VIN (Vehicle Identification Number)",
        "create.price": "Estimated Price (ETH)",
        "create.submit": "Mint Vehicle Identity",
        "create.minting": "Minting Protocol...",

        // Market Page
        "market.title": "Marketplace",
        "market.loading": "Loading Trust Protocol...",
        "market.empty": "No vehicles found. Be the first to list one!",
        "market.view": "View Details",

        // Dashboard
        "dash.title": "My Dashboard",
        "dash.connect": "Please connect your wallet to view dashboard.",
        "dash.vehicles": "My Vehicles",
        "dash.new": "Mint New",
        "dash.escrows": "Active Escrows",
        "dash.market_link": "Go to Market",
        "dash.market_desc": "to see all.",
        "dash.no_vehicles": "(Vehicles you own on-chain will appear here. For MVP, check Market.)",

        // Vehicle Detail
        "detail.owner": "Current Owner",
        "detail.you": "(You)",
        "detail.start_escrow": "Start Escrow Sale (Sell to Buyer)",
        "detail.processing": "Processing...",
        "detail.status": "Trust Status",
        "detail.price": "Price",
        "detail.deposit": "Deposit Funds",
        "detail.depositing": "Depositing...",
        "detail.transit": "Vehicle in transit / Inspection",
        "detail.confirm": "Confirm Delivery & Release Funds",
        "detail.complete": "Transaction Complete",
        "detail.loading": "Loading..."
    },
    kr: {
        "nav.market": "시장 둘러보기",
        "nav.sell": "내 차 팔기",
        "nav.dashboard": "대시보드",
        "nav.connect": "지갑 연결",
        "hero.title1": "신뢰",
        "hero.title2": "프로토콜",
        "hero.subtitle": "세계 최초의 탈중앙화 중고차 거래 플랫폼. 코드가 법이고, 평판이 화폐입니다.",
        "hero.cta.list": "차량 등록하기",
        "hero.cta.browse": "매물 구경하기",
        "feat.history.title": "불변의 기록",
        "feat.history.desc": "수리, 사고, 주행거리 등 모든 기록이 블록체인에 영구 저장됩니다. 조작은 불가능합니다.",
        "feat.nft.title": "NFT 차량 신분증",
        "feat.nft.desc": "모든 차량은 고유한 NFT(ERC-721)로 존재합니다. 소유권 이전은 즉시, 그리고 완벽하게 이루어집니다.",
        "feat.escrow.title": "안전 에스크로",
        "feat.escrow.desc": "차량을 받고 확정할 때까지 자금은 스마트 컨트랙트에 안전하게 보관됩니다. 사기 걱정 끝.",

        // Create Page
        "create.title": "차량 등록",
        "create.make": "제조사",
        "create.model": "모델명",
        "create.year": "연식",
        "create.mileage": "주행거리 (km)",
        "create.vin": "차대번호 (VIN)",
        "create.price": "희망 가격 (ETH)",
        "create.submit": "차량 신분증 발급 (Mint)",
        "create.minting": "프로토콜 기록 중...",

        // Market Page
        "market.title": "중고차 시장",
        "market.loading": "신뢰 프로토콜 로딩 중...",
        "market.empty": "등록된 차량이 없습니다. 첫 번째 판매자가 되어보세요!",
        "market.view": "상세 보기",

        // Dashboard
        "dash.title": "내 대시보드",
        "dash.connect": "대시보드를 보려면 지갑을 연결해주세요.",
        "dash.vehicles": "내 보유 차량",
        "dash.new": "신규 등록",
        "dash.escrows": "진행 중인 거래 (에스크로)",
        "dash.market_link": "시장으로 이동",
        "dash.market_desc": "하여 전체 매물 보기",
        "dash.no_vehicles": "(블록체인상의 소유 차량이 여기에 표시됩니다. MVP에서는 시장을 확인하세요.)",

        // Vehicle Detail
        "detail.owner": "현재 소유자",
        "detail.you": "(나)",
        "detail.start_escrow": "에스크로 판매 시작 (구매자 지정)",
        "detail.processing": "처리 중...",
        "detail.status": "신뢰 상태 (Status)",
        "detail.price": "가격",
        "detail.deposit": "구매 자금 예치 (Deposit)",
        "detail.depositing": "입금 중...",
        "detail.transit": "배송 및 차량 검수 중",
        "detail.confirm": "차량 인수 확정 및 자금 지급",
        "detail.complete": "거래 완료 (Transaction Complete)",
        "detail.loading": "정보 불러오는 중..."
    }
};

const LanguageContext = createContext<LanguageContextType>({
    language: "en",
    setLanguage: () => { },
    t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>("en");

    const t = (key: string) => {
        // @ts-ignore
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
