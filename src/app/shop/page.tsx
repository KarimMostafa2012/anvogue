"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import ShopSidebarList from "@/components/Shop/ShopSidebarList";
import Footer from "@/components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAllProducts } from "@/redux/slices/productSlice";
import { useTranslation } from "react-i18next";

export default function SidebarList() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const category = searchParams.get("category");

  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
      </div>
      <ShopSidebarList />
      <Footer />
    </>
  );
}
