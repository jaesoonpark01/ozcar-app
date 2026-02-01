// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useWeb3 } from "../components/Web3Provider";
import { useI18n } from "../hooks/useI18n";
import {
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  MousePointer2,
  Globe,
  Layers,
  Search,
  ArrowRight,
  TrendingUp,
  Award,
  Languages
} from "lucide-react";

export default function Home() {
  const { connectWallet, account } = useWeb3();
  const { t, lang, toggleLanguage } = useI18n();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-[#0052FF] selection:text-white">
      {/* 1. Global Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-8 ${scrollY > 50 ? "py-4 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5" : "py-8 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div className="text-2xl font-black tracking-tighter hover:scale-105 transition-transform cursor-pointer">OZCAR</div>
            <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link href="/marketplace" className="hover:text-white transition-colors">{t('nav_market')}</Link>
              <Link href="/explorer" className="hover:text-white transition-colors">{t('nav_explorer')}</Link>
              <Link href="/governance/report" className="hover:text-white transition-colors">{t('nav_trust_report')}</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all text-slate-400 hover:text-white"
            >
              <Languages className="w-3.5 h-3.5" />
              {lang === 'ko' ? 'EN' : 'KO'}
            </button>
            {account ? (
              <Link href="/wallet" className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                {account.substring(0, 6)}...{account.substring(38)}
              </Link>
            ) : (
              <button onClick={connectWallet} className="bg-[#0052FF] text-white px-7 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
                {t('nav_connect')}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Hero Section: The Vision */}
      <section className="relative h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0052FF]/30 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 animate-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-[#0052FF]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 text-blue-100">{t('hero_badge')}</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 whitespace-pre-line">
            {t('hero_title')}
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            {t('hero_desc')}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <Link href="/marketplace" className="group bg-white text-slate-950 px-10 py-5 rounded-3xl font-black text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-white/10">
              {t('hero_explore')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/trade-in" className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-3xl font-black text-sm hover:bg-white/10 transition-all">
              {t('hero_trade_in')}
            </Link>
            <Link href="/technician/dashboard" className="bg-slate-900/50 backdrop-blur-xl border border-white/10 text-white px-10 py-5 rounded-3xl font-black text-sm hover:bg-slate-900 transition-all">
              {t('hero_tech_portal')}
            </Link>
          </div>
        </div>

        {/* Floating Mouse Prompt */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <MousePointer2 className="w-6 h-6 rotate-45" />
        </div>
      </section>

      {/* 3. The Core Ecosystem Loop */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 p-12 rounded-[4rem] border border-white/5 hover:border-[#0052FF]/30 transition-all group">
            <ShieldCheck className="w-12 h-12 text-[#0052FF] mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black mb-4">{t('feat_tech_trust')}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {t('feat_tech_trust_desc')}
            </p>
          </div>
          <div className="bg-[#10B981]/5 p-12 rounded-[4rem] border border-[#10B981]/10 hover:border-[#10B981]/30 transition-all group">
            <TrendingUp className="w-12 h-12 text-[#10B981] mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black mb-4">{t('feat_econ_trust')}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {t('feat_econ_trust_desc')}
            </p>
          </div>
          <div className="bg-white/5 p-12 rounded-[4rem] border border-white/5 hover:border-[#00A3FF]/30 transition-all group">
            <Layers className="w-12 h-12 text-[#00A3FF] mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black mb-4">{t('feat_social_trust')}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {t('feat_social_trust_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Feature Showcase: Interactive Bento Grid */}
      <section className="py-32 bg-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-5xl font-black tracking-tight mb-4 whitespace-pre-line">{t('bento_title')}</h2>
            <p className="text-slate-500 font-medium text-xl">{t('bento_desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 bg-gradient-to-br from-[#0052FF] to-[#00A3FF] p-16 rounded-[4rem] relative overflow-hidden group shadow-2xl shadow-blue-500/10">
              <div className="relative z-10 max-w-sm">
                <h3 className="text-4xl font-black mb-6">{t('bento_ar_title')}</h3>
                <p className="text-blue-100 font-medium text-lg leading-relaxed mb-8">
                  {t('bento_ar_desc')}
                </p>
                <Link href="/vehicle/ar-demo" className="inline-flex bg-white text-slate-950 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                  {t('bento_ar_btn')}
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 pointer-events-none group-hover:translate-x-4 transition-transform duration-1000">
                <Globe className="w-full h-full scale-150" />
              </div>
            </div>

            <div className="md:col-span-4 bg-slate-900 p-12 rounded-[4rem] border border-white/5 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black mb-4">{t('bento_explorer_title')}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {t('bento_explorer_desc')}
                </p>
              </div>
              <Link href="/explorer" className="w-full mt-8 bg-white/5 border border-white/10 h-16 rounded-3xl flex items-center justify-center gap-4 hover:bg-white/10 transition-all text-sm font-black">
                <Search className="w-5 h-5 text-[#0052FF]" /> {t('bento_explorer_btn')}
              </Link>
            </div>

            <div className="md:col-span-4 bg-slate-900/50 p-12 rounded-[4rem] border border-white/5 flex flex-col justify-between">
              <Award className="w-12 h-12 text-[#10B981] mb-8" />
              <div>
                <h3 className="text-2xl font-black mb-4">{t('bento_jury_title')}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {t('bento_jury_desc')}
                </p>
              </div>
              <Link href="/governance/report" className="mt-8 text-[11px] font-black uppercase tracking-widest text-[#10B981] flex items-center gap-2 hover:opacity-100 opacity-60 transition-all">
                {t('bento_jury_btn')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="md:col-span-8 bg-white p-16 rounded-[4rem] text-slate-950 relative overflow-hidden group">
              <div className="relative z-10 max-w-sm">
                <div className="text-[10px] font-black text-[#0052FF] uppercase tracking-[0.3em] mb-4">{t('bento_ai_badge')}</div>
                <h3 className="text-4xl font-black mb-6">{t('bento_ai_title')}</h3>
                <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
                  {t('bento_ai_desc')}
                </p>
                <Link href="/market" className="inline-flex bg-slate-950 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                  {t('bento_ai_btn')}
                </Link>
              </div>
              {/* Pattern Decor */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Live Protocol Stats Ticker */}
      <div className="bg-[#0052FF] py-6 overflow-hidden whitespace-nowrap border-y border-white/10">
        <div className="flex animate-[ticker_30s_linear_infinite] gap-12 text-[10px] font-black uppercase tracking-[0.4em]">
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-4">OZCAR PROTOCOL <span className="opacity-40">●</span> POLYGON_MAINNET <span className="opacity-40">●</span> LATENCY: 12MS <span className="opacity-40">●</span> ACTIVE_CONTRACTS: {127 + i} <span className="opacity-40">●</span> TOTAL_VALUE_SECURED: $14.2M</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 6. Footer */}
      <footer className="py-32 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <div className="text-3xl font-black mb-4">OZCAR</div>
            <p className="text-slate-500 font-medium">{t('footer_tagline')}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link href="/governance/report" className="hover:text-white transition-colors">{t('footer_whitepaper')}</Link>
            <Link href="/admin/security" className="hover:text-white transition-colors">{t('footer_audit')}</Link>
            <a href="#" className="hover:text-white transition-colors">{t('footer_legal')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer_status')}</a>
          </div>
        </div>
        <div className="mt-32 text-center text-[10px] font-black uppercase tracking-[0.5em] opacity-20">
          {t('footer_bottom')}
        </div>
      </footer>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
