'use client';

import React from "react";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuEight from "@/components/Header/Menu/MenuEight";
import SliderNine from "@/components/Slider/SliderNine";
import TrendingNow from "@/components/Other/TrendingNow";
import Deal from "@/components/Other/Deal";
import productData from "@/data/Product.json";
import Banner from "@/components/Other/Banner";
import TabFeatures from "@/components/Other/TabFeatures";
import Benefit from "@/components/Home1/Benefit";
import Brand from "@/components/Home1/Brand";
import Footer from "@/components/Footer/Footer";

export default function Home() {

  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full style-nine">
        <MenuEight />
        <SliderNine />
      </div>
      <TrendingNow />
      <Deal start={0} limit={4} />
      <Banner />
      <TabFeatures data={productData} start={0} limit={8} />
      <Benefit props="md:mt-20 mt-10 py-10 px-2.5 bg-surface rounded-[32px]" />
      {/* <NewsInsight data={blogData} start={0} limit={3} /> */}
      <Brand />
      <Footer />
      {/* <ModalNewsletter /> */}
    </>
  );
}
