import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 AI 看面相 | 火马年运势预测",
  description: "上传照片，AI 大师为你预测 2026 丙午火马年运势！纯属娱乐，合家欢乐。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
