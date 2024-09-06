"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

import { getBuinessConfig } from "@/http/api/business/api";

import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import Header from "@/components/layout/header/Header";
import { Providers } from "@/context/providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [businessConfig, setBusinessConfig] = useState<any>(() => {
    // 在初次渲染时从 localStorage 中获取配置
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("businessConfig");
      return savedConfig ? JSON.parse(savedConfig) : null;
    }
    return null;
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getBuinessConfig();
        setBusinessConfig(response.data);
        // 将获取到的数据存储到 localStorage
        localStorage.setItem("businessConfig", JSON.stringify(response.data));
      } catch (error) {
        console.error("Failed to fetch business config:", error);
      }
    };

    if (typeof window !== "undefined" && window.location.pathname === "/") {
      fetchConfig();
    }
  }, []);
  useEffect(() => {
    if (businessConfig && businessConfig.title) {
      document.title = businessConfig.title;
    }
  }, [businessConfig]);

  return (
    <html lang="en">
      <head>
        <script defer={true} src="/js/iconfont.js" />
      </head>
      <body className={inter.className}>
        <Providers>
          <header>
            <Header />
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
