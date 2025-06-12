import React from "react";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuEight from "@/components/Header/Menu/MenuEight";
import SliderNine from "@/components/Slider/SliderNine";
import TrendingNow from "@/components/Home9/TrendingNow";
import Deal from "@/components/Home9/Deal";
import productData from "@/data/Product.json";
import Banner from "@/components/Home9/Banner";
import TabFeatures from "@/components/Home9/TabFeatures";
import Benefit from "@/components/Home9/Benefit";
// import blogData from "@/data/Blog.json";
import Brand from "@/components/Home9/Brand";
import Footer from "@/components/Footer/Footer";
import ModalNewsletter from "@/components/Modal/ModalNewsletter";


export default function Home() {
  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        
      />
      <div id="header" className="relative w-full style-nine">
        <MenuEight />
        <SliderNine />
      </div>
      <TrendingNow />
      <Deal start={0} limit={4} />
      <Banner />
      <TabFeatures start={0} limit={8} />
      <Benefit props="md:mt-20 mt-10 py-10 px-2.5 bg-surface rounded-[32px]" />
      {/* <NewsInsight data={blogData} start={0} limit={3} /> */}
      <Brand />
      <Footer />
      <ModalNewsletter />
    </>
  );
}