"use client";
import { useEffect, useState } from "react";
import { Button } from "@douyinfe/semi-ui";
import { IconChevronDown } from "@douyinfe/semi-icons";
import DOMPurify from "dompurify";
import { getCategory } from "@/http/api/category/api";
import { getCommodity } from "@/http/api/commodity/api";
import Icon from "@/components/custom/Icon";

export default function Home() {
  const [business, setBusiness] = useState<any>(null);
  const [category, setCategory] = useState<any>([]);
  const [checkedState, setCheckedState] = useState<number | null>(null);
  const [commodityData, setCommodityData] = useState<any>(null); // 用于存储商品数据

  // DOMPurify 防止 XSS 攻击
  const cleanHTML = business ? DOMPurify.sanitize(business.notice) : "";

  useEffect(() => {
    const fetchConfig = async () => {
      const businessObj: string = JSON.parse(
        localStorage.getItem("businessConfig")
      );
      setBusiness(businessObj);
      try {
        const response = await getCategory(businessObj?.user_id);
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

  const handleButtonClick = async (id) => {
    setCheckedState((prevState) => (prevState === id ? null : id));
    try {
      const response = await getCommodity(id);
      if (response && response.data) {
        setCommodityData(response.data); // 设置商品数据
      } else {
        setCommodityData(null);
      }
    } catch (error) {
      console.error("Failed to fetch commodity :", error);
      setCommodityData(null); // 清空商品数据
    }
  };

  const handleComodityButtonClick = () => {};

  return (
    <main className="w-full h-screen mt-16 p-4 flex flex-col bg-[url('/image/bg.jpg')] bg-cover bg-center">
      <div className="flex justify-center">
        <div className="flex w-full max-w-screen-lg flex-col space-y-8">
          {/* 公告部分 */}
          <div className="rounded-2xl shadow-custom-1 bg-white opacity-85">
            <div className="flex leading-8">
              <Icon className="ml-5" type="icon-tongzhigonggao" size={34} />
              <span className="font-bold text-slate-700">公告</span>
            </div>
            <div
              className="pt-2 mt-2 border-t text-amber-500 ml-5 font-bold border-dashed"
              dangerouslySetInnerHTML={{ __html: cleanHTML }}
            ></div>
          </div>

          {/* 购买部分 */}
          <div className="rounded-2xl shadow-custom-1 bg-white opacity-85">
            <div className="flex leading-8">
              <Icon className="ml-5" type="icon-goumai" size={28} />
              <span className="font-bold ml-1 text-slate-700">购买</span>
            </div>
            <div className="pt-2 border-t ml-5 font-medium border-dashed">
              <div className="text-slate-700 mt-3 mb-3">请选择商品分类</div>
              <div className="flex space-x-5 my-3">
                {category?.length > 0 ? (
                  category.map((cat) => (
                    <div key={cat.id}>
                      <Button
                        type="warning"
                        className="checkable-button"
                        icon={<IconChevronDown />}
                        iconPosition="right"
                        style={{
                          borderRadius: "10px",
                          cursor: "pointer",
                          border:
                            checkedState === cat.id
                              ? "1px dashed #3effb8"
                              : "none",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          boxShadow:
                            checkedState === cat.id
                              ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                              : "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                        onClick={() => handleButtonClick(cat.id)}
                      >
                        {cat.name}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div>未发现商品分类</div>
                )}
              </div>

              {/* 根据 commodityData 显示内容 */}
              {commodityData && (
                <div className="mt-5 mb-4">
                  {commodityData?.length > 0 ? (
                    commodityData.map((commodity) => (
                      <div key={commodity.id}>
                        <Button
                          type="warning"
                          className="checkable-button"
                          icon={<IconChevronDown />}
                          iconPosition="right"
                          style={{
                            borderRadius: "10px",
                            cursor: "pointer",
                            border:
                              checkedState === commodity.id
                                ? "1px dashed #3effb8"
                                : "none",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            boxShadow:
                              checkedState === commodity.id
                                ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                                : "0 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={() => handleComodityButtonClick(commodity)}
                        >
                          {commodity.name}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div>未发现商品分类</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
