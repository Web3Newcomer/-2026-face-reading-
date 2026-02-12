"use client";

import { FortuneResult, DIMENSION_LABELS } from "@/lib/types";

interface FortuneCardProps {
  result: FortuneResult;
  nickname: string;
  image?: string;
}

function ScoreCircle({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24 bg-white rounded-full shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center justify-center border-4 border-yellow-100 ring-2 ring-yellow-400">
      <svg className="absolute w-full h-full -rotate-90 p-1" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#FEF3C7" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke="url(#scoreGrad)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ animation: "score-fill 1s ease-out forwards" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-red-700 font-black text-3xl leading-none">{score}</span>
        <span className="text-[10px] text-yellow-600 font-bold">运势分</span>
      </div>
    </div>
  );
}

function DimensionBar({ label, score, comment }: { label: string; score: number; comment: string }) {
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-bold text-red-900 flex items-center gap-1">
          <span className="w-1 h-3 bg-red-600 rounded-full" />
          {label}
        </span>
        <span className="text-xs text-amber-700 font-black bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          {score}
        </span>
      </div>
      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
          style={{ width: `${score}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] opacity-30" />
        </div>
      </div>
      <p className="text-[10px] text-stone-500 mt-1.5 leading-relaxed pl-2 border-l-2 border-stone-200">
        {comment}
      </p>
    </div>
  );
}

export default function FortuneCard({ result, nickname, image }: FortuneCardProps) {
  const displayName = nickname || "有缘人";

  return (
    <div
      id="fortune-card"
      className="w-full max-w-sm mx-auto bg-stone-50 rounded-[2rem] overflow-hidden shadow-2xl relative"
    >
      {/* 边框纹理 */}
      <div className="absolute inset-0 border-[6px] border-double border-red-900/10 pointer-events-none rounded-[2rem] z-10" />

      {/* 顶部红色区域 */}
      <div className="festive-bg px-6 pt-8 pb-12 text-center relative overflow-hidden">
        {/* 背景纹理 */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-200 via-transparent to-transparent" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-0.5 rounded-full bg-black/20 text-yellow-100 text-[10px] tracking-widest border border-white/10">
            <span>丙午年</span>
            <span className="w-1 h-1 rounded-full bg-yellow-400" />
            <span>火马运程</span>
          </div>
          
          <h2 className="text-gold text-xl font-black tracking-wide mb-4 drop-shadow-md">
            2026 运势鉴定书
          </h2>
          
          {image && (
            <div className="w-24 h-24 rounded-full p-1 mx-auto bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          
          <p className="text-white font-bold text-lg mt-3 tracking-wide shadow-black drop-shadow-md">
            {displayName}
          </p>
        </div>

        {/* 装饰马纹 */}
        <svg className="absolute top-4 right-4 w-16 h-16 opacity-10 text-white fill-current rotate-12" viewBox="0 0 100 100">
           <path d="M20 50 C 20 40, 30 20, 50 20 C 60 20, 70 25, 80 30 C 80 30, 85 20, 90 15 C 90 15, 85 35, 80 40 C 80 50, 75 60, 70 70 L 65 90 L 55 90 L 60 70 C 50 70, 40 75, 30 80 L 25 90 L 15 90 L 20 70 C 15 65, 10 60, 10 50 Z" />
        </svg>
      </div>

      {/* 分数环 */}
      <div className="flex justify-center -mt-10 relative z-20">
        <ScoreCircle score={result.overall_score} />
      </div>

      <div className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-stone-100">
        {/* 关键词 */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {result.keywords.map((kw) => (
            <span
              key={kw}
              className="bg-red-50 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-100 shadow-sm"
            >
              #{kw}
            </span>
          ))}
        </div>

        {/* 面相解读 */}
        <div className="mb-6 relative">
          <span className="absolute -top-2 -left-2 text-2xl text-red-100 font-serif">❝</span>
          <p className="text-sm text-stone-600 leading-relaxed text-center px-4 italic font-medium">
            {result.face_reading}
          </p>
          <span className="absolute -bottom-4 -right-1 text-2xl text-red-100 font-serif">❞</span>
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent my-4" />

        {/* 各维度运势 */}
        <div className="space-y-4">
          {Object.entries(result.dimensions).map(([key, dim]) => (
            <DimensionBar key={key} label={DIMENSION_LABELS[key] || key} score={dim.score} comment={dim.comment} />
          ))}
        </div>
      </div>

      {/* 总结 */}
      <div className="px-8 mt-5 mb-2 text-center">
        <p className="text-xs text-stone-500 leading-relaxed font-light">{result.summary}</p>
      </div>

      {/* 幸运信息 */}
      <div className="flex justify-center gap-4 px-6 my-6">
        <div className="flex-1 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 text-center border border-orange-200">
          <p className="text-[10px] text-orange-400 font-bold mb-1 uppercase tracking-wider">LUCKY COLOR</p>
          <p className="text-red-800 font-bold text-sm">{result.lucky_color}</p>
        </div>
        <div className="flex-1 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 text-center border border-yellow-200">
          <p className="text-[10px] text-yellow-500 font-bold mb-1 uppercase tracking-wider">LUCKY NUMBER</p>
          <p className="text-yellow-800 font-bold text-sm">{result.lucky_number}</p>
        </div>
      </div>

      {/* 底部水印 */}
      <div className="bg-stone-900 text-center py-4 relative overflow-hidden flex flex-col items-center justify-center gap-2">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "10px 10px"
        }} />
        
        <p className="text-stone-400 text-[10px] tracking-[0.2em] relative z-10 font-light">
          2026 丙午火马年 · AI 运势鉴定
        </p>

        {/* Flxxx Copyright */}
        <div className="relative z-10 flex items-center gap-2 mt-1">
          <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20 bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)]">
             <img 
               src="/flxxx-logo.png" 
               alt="" 
               className="w-full h-full object-cover object-center scale-[2.5]" 
             />
          </div>
          <span className="text-[9px] text-stone-300 font-bold tracking-widest uppercase drop-shadow-sm">
            Powered by Flxxx Crypto AI
          </span>
        </div>
      </div>
    </div>
  );
}
