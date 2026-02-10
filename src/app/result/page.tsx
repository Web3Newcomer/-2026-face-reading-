"use client";

import { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import FortuneCard from "@/components/FortuneCard";
import type { FortuneResult } from "@/lib/types";
import BackgroundPattern from "@/components/Pattern";

export default function ResultPage() {
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [image, setImage] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [nyImage, setNyImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const dataStr = sessionStorage.getItem("fortune_result");
      if (!dataStr) { setError(true); return; }
      setResult(JSON.parse(dataStr));
      setImage(sessionStorage.getItem("fortune_image") || undefined);
      setName(sessionStorage.getItem("fortune_name") || "");
    } catch {
      setError(true);
    }
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const card = document.getElementById("fortune-card");
      if (!card) return;
      const canvas = await html2canvas(card, {
        scale: 2, useCORS: true, backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `2026火马年运势-${name || "预测"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }, [name]);

  const handleGenerateNY = useCallback(async () => {
    if (!image || !result) return;
    setGenerating(true);
    setGenError(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          keywords: result.keywords,
          summary: result.summary,
        }),
      });
      if (!res.ok) throw new Error("生成失败");
      const data = await res.json();
      setNyImage(data.image);
    } catch {
      setGenError("新年照生成失败，请重试");
    } finally {
      setGenerating(false);
    }
  }, [image, result]);

  if (error || !result) {
    return (
      <div className="festive-bg min-h-screen flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        <BackgroundPattern />
        <div className="relative z-10 text-center">
           <p className="text-red-200 text-lg mb-4">{error ? "未找到预测结果" : "加载中..."}</p>
           {error && (
             <a href="/predict" className="inline-block border border-yellow-500/40 text-yellow-300 px-6 py-2 rounded-full hover:bg-yellow-500/10 transition-colors">
               ← 返回重测
             </a>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="festive-bg min-h-screen px-4 py-8 relative overflow-hidden">
      <BackgroundPattern />
      
      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full flex justify-center mb-8"
        >
          <div className="relative w-full">
            {/* 卡片背后的光晕 */}
            <div className="absolute top-10 left-0 right-0 h-full bg-red-600/20 blur-[60px] rounded-full pointer-events-none" />
            <FortuneCard result={result} nickname={name} image={image} />
          </div>
        </motion.div>

        {/* 新年照区域 */}
        <motion.div 
          className="w-full glass-card p-1 rounded-3xl border border-yellow-500/20 shadow-2xl overflow-hidden relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* 金色光泽动画 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
          
          <div className="bg-black/20 p-6 rounded-[20px]">
            <div className="flex flex-col items-center gap-5">
              <div className="text-center">
                <h3 className="text-gold font-bold text-xl mb-1 tracking-wide font-serif">✨ 火马年限定照</h3>
                <p className="text-red-200/50 text-xs">AI 为您绘制 2026 专属形象</p>
              </div>
              
              {!nyImage && !generating && (
                <button
                  onClick={handleGenerateNY}
                  className="w-full bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-yellow-100 font-bold px-6 py-4 rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5 border border-white/10 flex items-center justify-center gap-2"
                >
                  <span>🎨</span> 生成我的新年照
                </button>
              )}
              
              {generating && (
                <div className="flex flex-col items-center gap-3 py-6 bg-black/10 w-full rounded-xl border border-white/5">
                  <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_#FBBF24]" />
                  <p className="text-yellow-200/80 text-sm animate-pulse">AI 丹青妙手绘制中...</p>
                </div>
              )}
              
              {genError && <p className="text-red-300 text-sm bg-red-900/50 px-4 py-2 rounded-lg border border-red-500/30">{genError}</p>}
              
              {nyImage && (
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-yellow-500/30 mb-4 group copper-border">
                    <img src={nyImage} alt="新年照" className="w-full" />
                    <a 
                       href={nyImage} 
                       download={`2026新年照-${name || "预测"}.jpg`}
                       className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                       <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold border border-white/30">点击下载</span>
                    </a>
                  </div>
                  
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.download = `2026新年照-${name || "预测"}.jpg`;
                      link.href = nyImage;
                      link.click();
                    }}
                    className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-200 font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>⬇️</span> 保存美照
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 底部按钮组 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1a0500] to-transparent z-20 flex justify-center">
          <div className="flex flex-row w-full max-w-xl gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 btn-gold disabled:opacity-50 text-red-950 font-black px-4 py-4 rounded-full shadow-lg text-lg flex items-center justify-center gap-2"
            >
              {saving ? "生成中..." : (
                <>
                  <span>📥</span> 保存运势卡
                </>
              )}
            </button>
            
            <a
              href="/predict"
              className="flex-none px-6 py-4 rounded-full glass-card border-gold text-yellow-200/90 font-bold hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <span>🔄 重测</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
