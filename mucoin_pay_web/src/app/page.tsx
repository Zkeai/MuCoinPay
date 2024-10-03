"use client";
import { useEffect, useState } from "react";
import { Notice } from "@/components/index/Notice";
import { CommodityInfo } from "@/components/index/CommodityInfo";
import { CommodityPay } from "@/components/index/CommodityPay";
import { CategoryButton } from "@/components/index/CategoryButton";
import { CommodityButton } from "@/components/index/CommodityButton";
import { getCategory } from "@/http/api/category/api";
import { getCommodity } from "@/http/api/commodity/api";
import Icon from "@/components/custom/Icon";

export default function Home() {
  const [business, setBusiness] = useState<any>(null);
  const [category, setCategory] = useState<any>([]);
  const [checkedCommodityState, setCheckedCommodityState] = useState<
    number | null
  >(null);
  const [checkedState, setCheckedState] = useState<number | null>(null);
  const [commodityData, setCommodityData] = useState<any>(null);
  const [commodityInfo, setCommodityInfo] = useState<boolean>(false);
  const [checkedCommodityInfo, setCheckedCommodityInfo] = useState<any>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const businessObj: string = JSON.parse(
        localStorage.getItem("businessConfig")
      );
      setBusiness(businessObj);
      try {
        const response = await getCategory(businessObj?.user_id);
        setCategory(response.data);
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
        setCommodityData(response.data);
      } else {
        setCommodityData(null);
      }
    } catch (error) {
      console.error("Failed to fetch commodity :", error);
      setCommodityData(null);
    }
  };

  const handleComodityButtonClick = (commodity) => {
    setCheckedCommodityState((prevState) =>
      prevState === commodity.id ? null : commodity.id
    );
    setCommodityInfo(!commodityInfo);
    setCheckedCommodityInfo(commodity);
  };

  return (
    <main className="w-full h-screen mt-16 p-4 flex flex-col bg-[url('/image/bg.jpg')] bg-cover bg-center">
      <div className="flex justify-center">
        <div className="flex w-full max-w-screen-lg flex-col space-y-5">
          {/* 公告 */}
          {business && <Notice notice={business.notice} />}
          {/* 商品分类 */}
          <div className="rounded-2xl shadow-custom-1 bg-white opacity-85">
            <div className="flex leading-6 ml-5">
              <Icon type="icon-smiling_face_with_hearts_flat" size={22} />
              <span className="font-bold ml-1 text-slate-700">购买</span>
            </div>
            <div className="pt-2 border-t ml-5 font-medium border-dashed">
              <div className="text-slate-700 mt-3 mb-3">请选择商品分类</div>
              <div className="flex space-x-5 my-3 mb-8">
                {category.length > 0 ? (
                  category.map((cat) => (
                    <CategoryButton
                      key={cat.id}
                      category={cat}
                      checkedState={checkedState}
                      onClick={handleButtonClick}
                    />
                  ))
                ) : (
                  <div>未发现商品分类</div>
                )}
              </div>
              {commodityData && (
                <div className="mt-5 mb-4">
                  <div className="text-slate-700 mt-3 mb-2">请选择商品</div>
                  {commodityData.length > 0 ? (
                    commodityData.map((commodity) => (
                      <CommodityButton
                        key={commodity.id}
                        commodity={commodity}
                        checkedState={checkedCommodityState}
                        onClick={handleComodityButtonClick}
                      />
                    ))
                  ) : (
                    <div>未发现商品</div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* 商品信息 */}
          {commodityInfo && <CommodityInfo commodity={checkedCommodityInfo} />}
          {/* 付款方式 */}
          {commodityInfo && <CommodityPay commodity={checkedCommodityInfo} />}
        </div>
      </div>
    </main>
  );
}
