"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Lantern from "@/components/Lantern";
import Horse from "@/components/Horse";
import BackgroundPattern from "@/components/Pattern";
import Sparkles from "@/components/Sparkles";

export default function Home() {
  return (
    <main className="festive-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-6">
      <BackgroundPattern />
      <Sparkles />

      <div className="absolute top-0 left-10 z-20 lantern-sway">
        <Lantern side="left" delay={0.2} />
      </div>
      <div className="absolute top-0 right-10 z-20 lantern-sway" style={{ animationDelay: "1s" }}>
        <Lantern side="right" delay={0.4} />
      </div>

      {/* 装饰性光晕 - 旭日东升 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-red-600/30 to-orange-500/20 blur-[120px] rounded-full pointer-events-none" />

      {/* 主要内容 */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto w-full">
        
        {/* 马年视觉中心 */}
        <motion.div
          className="mb-6 relative"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="transform scale-125 md:scale-150">
             <Horse />
          </div>
        </motion.div>

        {/* 标题文字 */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-2 rounded-full glass-card border-gold shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-yellow-100/90 text-sm tracking-[0.3em] uppercase font-bold">
              丙午火马年 · 2026
            </span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>

          <h1 className="relative flex flex-col items-center">
            <span className="block text-7xl md:text-9xl font-black text-gold mb-2 tracking-tighter drop-shadow-2xl font-serif">
              2026
            </span>
            <span className="block text-5xl md:text-7xl font-black fire-text tracking-[0.1em] mb-8 font-serif">
              AI 观相
            </span>
          </h1>

          <p className="text-red-100/80 text-lg md:text-xl mb-12 max-w-lg mx-auto leading-relaxed font-light tracking-wide">
            赤骥奔腾，旭日东升。
            <br />
            上传照片，测算您的<span className="text-yellow-300 font-bold mx-1 border-b border-yellow-300/50">火马年</span>专属运程。
          </p>
        </motion.div>

        {/* CTA 按钮 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            href="/predict"
            className="btn-gold group relative inline-flex items-center justify-center px-20 py-6 rounded-full text-xl md:text-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform"
          >
            <span className="relative z-10 flex items-center gap-3 font-serif">
              <span className="text-2xl">⚡️</span> 开启运势 
            </span>
          </Link>
        </motion.div>

        {/* 底部装饰文案 */}
        <motion.div
          className="absolute -bottom-32 md:-bottom-40 flex items-center gap-8 opacity-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
        >
           <div className="h-px w-24 bg-gradient-to-r from-transparent to-yellow-500/50" />
           <span className="text-yellow-500/50 text-sm tracking-[0.8em] font-light">
             鸿运当头 · 马到成功
           </span>
           <div className="h-px w-24 bg-gradient-to-l from-transparent to-yellow-500/50" />
        </motion.div>
      </div>
      
      {/* 底部版权 */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-red-900/30 text-[10px] tracking-wider">仅供娱乐 · AI 生成结果仅供参考</p>
      </div>
    </main>
  );
}
