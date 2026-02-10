"use client";

import { useRef } from "react";

interface PhotoUploadProps {
  onSelect: (imageData: string) => void;
}

export default function PhotoUpload({ onSelect }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) onSelect(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-yellow-500/30 text-yellow-100 font-medium text-sm px-6 py-4 rounded-full transition-all group"
      >
        <span className="group-hover:scale-110 transition-transform">🖼️</span>
        <span>从相册选择照片</span>
      </button>
    </div>
  );
}
