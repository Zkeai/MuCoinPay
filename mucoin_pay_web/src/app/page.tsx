"use client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategory } from "@/http/api/category/api";
export default function Home() {
  const [category, setCategory] = useState<any>(() => {
    // 在初次渲染时从 localStorage 中获取配置
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("category");
      return savedConfig ? JSON.parse(savedConfig) : null;
    }
    return null;
  });

  useEffect(() => {
    const fetchConfig = async () => {
      const userID: string = JSON.parse(
        localStorage.getItem("businessConfig")
      )?.user_id;

      try {
        const response = await getCategory(userID);
        setCategory(response.data);
        // 将获取到的数据存储到 localStorage
        localStorage.setItem("category", JSON.stringify(response.data));
      } catch (error) {
        console.error("Failed to fetch category :", error);
      }
    };

    if (typeof window !== "undefined" && window.location.pathname === "/") {
      fetchConfig();
    }
  }, []);

  return <main className="mt-16 p-4 h-auto">loading...</main>;
}
