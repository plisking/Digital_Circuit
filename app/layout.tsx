import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "数字电路仿真 - 经典集成电路",
  description: "Digital Circuit Simulation for Classic ICs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased h-screen w-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
