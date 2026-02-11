"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BackgroundPattern from "@/components/Pattern";
import { getHistory, clearHistory, type HistoryEntry } from "@/lib/history";

function loadHistory(): { entries: HistoryEntry[]; loaded: boolean } {
  if (typeof window === "undefined") return { entries: [], loaded: false };
  return { entries: getHistory(), loaded: true };
}

export default function HistoryPage() {
  const router = useRouter();
  const [state, setState] = useState(loadHistory);

  const handleClear = () => {
    if (!confirm("确定清空所有历史记录？")) return;
    clearHistory();
    setState({ entries: [], loaded: true });
  };

  const handleView = (entry: HistoryEntry) => {
    sessionStorage.setItem("fortune_result", JSON.stringify(entry.result));
    sessionStorage.setItem("fortune_image", entry.thumbnail);
    sessionStorage.setItem("fortune_name", entry.nickname);
    router.push("/result");
  };

  return (
    <div className="festive-bg min-h-screen px-4 py-8 relative overflow-hidden">
      <BackgroundPattern />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Header */}
        <motion.a
          href="/"
          className="inline-flex items-center gap-2 text-yellow-200/80 text-sm mb-6 px-4 py-2 rounded-full glass-card hover:bg-white/10 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span>↩</span> 返回首页
        </motion.a>

        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="text-4xl mb-3">📜</div>
          <h1 className="text-gold text-3xl font-black font-serif tracking-tight">历史记录</h1>
          <p className="text-red-200/50 text-xs mt-2">最近 {state.entries.length} 次预测</p>
        </motion.div>

        {/* List or empty state */}
        {state.loaded && state.entries.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            {state.entries.map((entry, i) => (
              <HistoryItem key={entry.id} entry={entry} index={i} onView={handleView} />
            ))}
          </div>
        )}

        {/* Clear button */}
        {state.entries.length > 0 && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handleClear}
              className="text-red-400/60 text-xs border border-red-500/20 px-4 py-2 rounded-full hover:bg-red-500/10 transition-colors"
            >
              清空全部记录
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function HistoryItem({
  entry,
  index,
  onView,
}: {
  entry: HistoryEntry;
  index: number;
  onView: (e: HistoryEntry) => void;
}) {
  const date = new Date(entry.timestamp);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

  return (
    <motion.button
      onClick={() => onView(entry)}
      className="w-full glass-card rounded-2xl p-4 border border-yellow-500/15 hover:border-yellow-500/30 hover:bg-white/5 transition-all text-left flex items-center gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden copper-border flex-shrink-0">
        <img src={entry.thumbnail} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-yellow-100 font-bold text-sm truncate">
            {entry.nickname || "匿名"}
          </span>
          <span className="text-red-200/30 text-xs">{dateStr}</span>
        </div>
        <p className="text-red-200/50 text-xs mt-0.5 truncate">
          {entry.result.summary}
        </p>
      </div>
      <div className="flex-shrink-0 text-center">
        <div className="text-gold text-xl font-black font-serif">{entry.result.overall_score}</div>
        <div className="text-red-200/30 text-[10px]">总分</div>
      </div>
    </motion.button>
  );
}

function EmptyState() {
  return (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-5xl mb-4 opacity-30">🐴</div>
      <p className="text-red-200/40 text-sm">还没有预测记录</p>
      <a
        href="/predict"
        className="inline-block mt-4 text-yellow-300/70 text-sm border border-yellow-500/20 px-5 py-2 rounded-full hover:bg-yellow-500/10 transition-colors"
      >
        去测一次运势
      </a>
    </motion.div>
  );
}
