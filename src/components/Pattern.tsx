"use client";

export default function BackgroundPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-10">
      <svg width="100%" height="100%">
        <pattern id="cloud-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
           <path d="M10 50 Q 25 30 40 50 T 70 50 T 100 50" fill="none" stroke="#FCD34D" strokeWidth="2"/>
           <path d="M0 20 Q 20 0 40 20 T 80 20" fill="none" stroke="#FCD34D" strokeWidth="2" opacity="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#cloud-pattern)" />
      </svg>
    </div>
  );
}
