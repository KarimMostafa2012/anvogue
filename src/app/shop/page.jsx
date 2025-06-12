"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import ShopSidebarList from "@/components/Shop/ShopSidebarList";
// import productData from "@/data/Product.json";
import Footer from "@/components/Footer/Footer";

export default function SidebarList() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  // const [productData, setProductData] = useState();
  // useEffect(() => {
  //   fetch("https://api.malalshammobel.com/products/", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         console.log(response);
  //       } else {
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       setProductData(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // }, []);
  // if (!productData) {
  //   return <div>loading..</div>;
  // }

  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
      </div>
      <ShopSidebarList productPerPage={12} dataType={type} />
      <Footer />
    </>
  );
}
