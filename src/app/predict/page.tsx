"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Camera from "@/components/Camera";
import PhotoUpload from "@/components/PhotoUpload";
import LoadingAnimation from "@/components/LoadingAnimation";
import { ZODIAC_ANIMALS } from "@/lib/types";
import BackgroundPattern from "@/components/Pattern";
import { addHistory, createThumbnail } from "@/lib/history";

type Mode = "choose" | "camera" | "preview" | "loading";

// 压缩图片到指定最大宽度，降低质量
function compressImage(dataUrl: string, maxWidth = 512, quality = 0.6): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
    });
}

export default function PredictPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("choose");
  const [image, setImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [zodiac, setZodiac] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleImage = (data: string) => {
    setImage(data);
    setMode("preview");
  };

  const handleSubmit = async () => {
    if (!image) return;
    setMode("loading");
    setError(null);

    try {
      // 压缩图片再发送
      const compressed = await compressImage(image);

      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: compressed,
          nickname: nickname || undefined,
          zodiac: zodiac || undefined,
        }),
      });

      if (!res.ok) throw new Error("预测失败，请重试");

      const data = await res.json();
      sessionStorage.setItem("fortune_result", JSON.stringify(data));
      sessionStorage.setItem("fortune_image", compressed);
      sessionStorage.setItem("fortune_name", nickname);

      // Save to history
      const thumbnail = await createThumbnail(compressed);
      addHistory({ nickname, result: data, thumbnail });

      router.push("/result");
    } catch {
      setError("预测失败，请稍后重试");
      setMode("preview");
    }
  };

  return (
    <div className="festive-bg min-h-screen px-4 py-8 relative overflow-hidden flex flex-col">
      <BackgroundPattern />
      
      {/* 返回按钮 */}
      <motion.a
        href="/"
        className="relative z-10 self-start inline-flex items-center gap-2 text-yellow-200/80 text-sm mb-4 px-4 py-2 rounded-full glass-card hover:bg-white/10 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span>↩</span> 返回首页
      </motion.a>

      <div className="relative z-10 w-full max-w-lg mx-auto flex-1 flex flex-col justify-center">
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="inline-block text-5xl mb-4 filter drop-shadow-xl animate-bounce">🐴</div>
          <h1 className="text-gold text-4xl font-black tracking-tight font-serif">上传面相</h1>
          <p className="text-red-200/80 text-sm mt-3 font-light tracking-wide">
            请上传清晰正面照，AI 正在连线<span className="text-yellow-400 font-bold">天机</span>...
          </p>
        </motion.div>

        {/* 加载状态 */}
        {mode === "loading" && <LoadingAnimation />}

        {/* 选择模式 */}
        {mode === "choose" && (
          <ChooseMode
            onCamera={() => setMode("camera")}
            onSelect={handleImage}
          />
        )}

        {/* 摄像头模式 */}
        {mode === "camera" && (
          <div className="rounded-3xl overflow-hidden copper-border shadow-2xl">
            <Camera onCapture={handleImage} onClose={() => setMode("choose")} />
          </div>
        )}

        {/* 预览模式 */}
        {mode === "preview" && image && (
          <PreviewMode
            image={image}
            nickname={nickname}
            zodiac={zodiac}
            error={error}
            onNicknameChange={setNickname}
            onZodiacChange={setZodiac}
            onSubmit={handleSubmit}
            onRetake={() => { setImage(null); setMode("choose"); }}
          />
        )}
      </div>
    </div>
  );
}

function ChooseMode({
  onCamera,
  onSelect,
}: {
  onCamera: () => void;
  onSelect: (data: string) => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative group cursor-pointer" onClick={onCamera}>
        {/* 铜镜效果外框 */}
        <div className="absolute -inset-4 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full opacity-30 blur-lg group-hover:opacity-50 transition-opacity" />
        <div className="w-64 h-64 rounded-full copper-border bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-[-100%] group-hover:translate-y-[100%]" />
          <span className="text-6xl mb-2">📸</span>
          <span className="text-yellow-200/80 text-sm tracking-widest font-serif">点击拍照</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs items-center">
        <div className="w-full relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-yellow-500/20"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-transparent px-2 text-yellow-500/50">或</span>
          </div>
        </div>

        <div className="glass-card rounded-full overflow-hidden w-full hover:bg-white/5 transition-colors">
          <PhotoUpload onSelect={onSelect} />
        </div>
      </div>
      
      <div className="mt-4 px-4 py-3 bg-red-950/30 rounded-xl border border-red-500/20 max-w-xs text-center">
        <p className="text-red-200/60 text-xs flex flex-col gap-1">
          <span className="font-bold text-yellow-500/80">🔒 隐私安全承诺</span>
          <span>上传的照片只提供给 AI 分析<br/>本网站不会保存任何面部数据</span>
        </p>
      </div>
    </motion.div>
  );
}

function PreviewMode({
  image,
  nickname,
  zodiac,
  error,
  onNicknameChange,
  onZodiacChange,
  onSubmit,
  onRetake,
}: {
  image: string;
  nickname: string;
  zodiac: string;
  error: string | null;
  onNicknameChange: (v: string) => void;
  onZodiacChange: (v: string) => void;
  onSubmit: () => void;
  onRetake: () => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 照片预览 - 铜镜风格 */}
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.15)] copper-border mx-auto">
        <img src={image} alt="预览" className="w-full h-full object-cover transform scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent pointer-events-none" />
      </div>

      {/* 可选信息 */}
      <div className="w-full max-w-xs flex flex-col gap-4">
        <div className="relative group">
          <input
            type="text"
            placeholder="阁下尊姓大名（选填）"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            maxLength={10}
            className="w-full px-6 py-4 rounded-xl bg-black/20 border border-yellow-500/30 text-yellow-100 placeholder-yellow-500/30 text-center focus:outline-none focus:border-yellow-500/60 focus:bg-black/30 transition-all backdrop-blur-sm shadow-inner font-serif"
          />
        </div>
        
        <div className="relative group">
          <select
            value={zodiac}
            onChange={(e) => onZodiacChange(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-black/20 border border-yellow-500/30 text-yellow-100 text-center focus:outline-none focus:border-yellow-500/60 focus:bg-black/30 transition-all appearance-none backdrop-blur-sm shadow-inner font-serif cursor-pointer"
          >
            <option value="" className="text-gray-500 bg-red-950">选择您的生肖（选填）</option>
            {ZODIAC_ANIMALS.map((z) => (
              <option key={z} value={z} className="text-yellow-100 bg-red-900">{z}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500/50">▼</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/80 border border-red-500/50 px-6 py-3 rounded-lg backdrop-blur-md">
          <p className="text-red-200 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </p>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
        <button
          onClick={onSubmit}
          className="btn-gold w-full text-red-950 font-black px-8 py-4 rounded-full text-xl shadow-2xl flex items-center justify-center gap-2 group"
        >
          <span>🔮</span> 
          <span>开坛测算</span>
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </button>
        <button
          onClick={onRetake}
          className="w-full border border-yellow-500/20 text-yellow-200/60 px-6 py-3 rounded-full text-sm hover:bg-yellow-500/5 hover:text-yellow-200 transition-all"
        >
          重选照片
        </button>
      </div>
    </motion.div>
  );
}
