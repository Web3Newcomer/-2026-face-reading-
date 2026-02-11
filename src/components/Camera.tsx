"use client";

import { useRef, useState, useCallback } from "react";

interface CameraProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export default function Camera({ onCapture, onClose }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStreaming(true);
    } catch {
      setError("无法访问摄像头，请检查权限设置");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // 镜像翻转处理 (如果是前置摄像头)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", 0.8);
    stopCamera();
    onCapture(data);
  }, [stopCamera, onCapture]);

  // 通过 ref callback 在 video 挂载时启动摄像头
  const videoCallbackRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (node) startCamera();
      else stopCamera();
    },
    [startCamera, stopCamera],
  );

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full">
      <div className="relative w-full h-full min-h-[300px] bg-black overflow-hidden flex items-center justify-center group">
        <video
          ref={videoCallbackRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]"
        />
        
        {/* 取景框辅助线 */}
        {streaming && (
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-yellow-400 rounded-full border-dashed" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-yellow-400/50" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-yellow-400/50" />
          </div>
        )}

        {!streaming && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 z-10">
            <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-yellow-200/80 text-sm">正在启动摄像头...</span>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 z-20 px-6 text-center">
            <span className="text-4xl">🚫</span>
            <p className="text-red-300 text-sm">{error}</p>
            <button
               onClick={startCamera}
               className="px-4 py-2 bg-white/10 rounded-full text-xs text-yellow-200 border border-yellow-500/30"
            >
              重试
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8 z-30">
        <button
          onClick={() => { stopCamera(); onClose(); }}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          ✕
        </button>
        
        {streaming && (
          <button
            onClick={capture}
            className="w-20 h-20 rounded-full border-4 border-white/30 p-1 flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
          >
            <div className="w-full h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
          </button>
        )}
        
        <div className="w-12 h-12" /> {/* 占位符以保持居中 */}
      </div>
    </div>
  );
}
