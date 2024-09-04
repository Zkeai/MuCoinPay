"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Icon from "@/components/custom/Icon";
import Style from "@/components/components.module.css";
import { Popover } from "@douyinfe/semi-ui";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import JSonData from "@/config/header.json";

interface SubMenuItem {
  name: string;
  path?: string;
  click?: boolean;
  icon?: string;
  item: SubMenuItem[];
}

interface MenuItem {
  name: string;
  path?: string;
  click?: boolean;
  icon?: string;
  item: SubMenuItem[];
}

const renderSubMenu = (items: SubMenuItem[]) => {
  return (
    <ul className="flex space-x-10 min-w-[200px]  w-auto py-8 px-8 sm:space-x-2 sm:min-w-[50px]">
      <div className="flex space-x-10 min-w-[200px] w-auto justify-center">
        {items.map((subItem, index) => (
          <li key={index} className="mr-4 min-w-[100px]">
            <div className="flex items-center space-x-2 text-black cursor-default pl-4 font-bold">
              {subItem.icon && (
                <Icon type={subItem.icon} size={20} color="blue" />
              )}
              <span>
                <a
                  key={index}
                  className="hover:text-amber-500"
                  href={subItem.path || "#"}
                >
                  {subItem.name}
                </a>
              </span>
            </div>
            {subItem.item && subItem.item.length > 0 && (
              <div className="mt-8 flex flex-col space-y-6 items-center justify-center">
                {subItem.item.map((item, index) => (
                  <a
                    key={index}
                    className="hover:text-amber-500"
                    href={item.path || "#"}
                  >
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            )}
          </li>
        ))}
      </div>
    </ul>
  );
};

const Header: React.FC = () => {
  const router = useRouter();
  const [menu, setMenu] = useState(JSonData.item[0].item as MenuItem[]);
  const [businessConfig, setBusinessConfig] = useState<{
    shop_name?: string;
  } | null>(null);
  const { address, isConnected } = useAccount();
  const titleClickHandle = () => {
    router.push("/");
  };

  useEffect(() => {
    // Check if running in client side before accessing localStorage
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("businessConfig");
      if (savedConfig) {
        setBusinessConfig(JSON.parse(savedConfig));
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="fixed top-0 left-0 right-0 flex items-center shadow-md font-bold h-16 p-4 z-100 backdrop-blur">
      <div className="flex flex-none  lg:space-x-10  justify-center text-center">
        <Icon
          className={Style.headLeftIcon}
          type="icon-ciyuanxiaozhen"
          size={25}
        />
        <div className={Style.title} onClick={titleClickHandle}>
          <span className={Style.text}>
            {businessConfig?.shop_name || "木鱼店铺"}
          </span>
        </div>
      </div>
      <div className="flex-grow ml-4 flex md:justify-center">
        <nav>
          <ul className="flex lg:space-x-8 ">
            {menu.map((menuItem, index) => (
              <li key={index} className="relative group">
                <Popover content={renderSubMenu(menuItem.item)}>
                  <button
                    href={menuItem.path || "#"}
                    className="flex items-center px-2 py-1 rounded-lg text-lg hover:bg-amber-500 hover:text-white"
                  >
                    {menuItem.icon && (
                      <span className={`iconfont ${menuItem.icon} mr-2`}></span>
                    )}
                    {menuItem.name}
                  </button>
                </Popover>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="relative w-1/4   flex-none flex pb-10 md:pb-13">
        <div className="absolute right-0">
          <ConnectButton
            label="登录"
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
