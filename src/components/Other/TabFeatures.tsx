"use client";

import React, { useState, useEffect } from "react";
import Product from "../Product/Product";
import { ProductType } from "@/type/ProductType";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, newArrivals, bestSelling } from "@/redux/slices/productSlice";
import { useTranslation } from 'react-i18next';

interface Props {
  data: Array<ProductType>;
  start: number;
  limit: number;
}

const TabFeatures: React.FC<Props> = ({ data, start, limit }) => {
  const { t } = useTranslation();
  const currentLanguage = useSelector((state: RootState) => state.language);
  const [activeTab, setActiveTab] = useState<string>("on sale");
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector(
    (state: RootState) => state.products
  );

  const handleTabClick = (item: string) => {
    setActiveTab(item);
  };
  useEffect(() => {
    console.log(activeTab)
    const getFilterData = () => {
      if (activeTab === "on sale") {
        dispatch(getAllProducts({
          params: { lang: currentLanguage, has_offer: true, page_size: 8 },
        }));
      }

      if (activeTab === "new arrivals") {
        dispatch(newArrivals({
          params: { lang: currentLanguage, page_size: 8 },
        }));
      }

      if (activeTab === "best sellers") {
        dispatch(bestSelling({
          params: {
            lang: currentLanguage,
            page_size: 8,
          },
        }));
      }
    };
    getFilterData();
  }, [dispatch, activeTab]);

  return (
    <>
      <div className="tab-features-block md:pt-20 pt-10">
        <div className="container">
          <div className="heading flex flex-col items-center text-center">
            <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl">
              {[
                { id: "best sellers", key: "bestSellers" },
                { id: "on sale", key: "onSale" },
                { id: "new arrivals", key: "newArrivals" }
              ].map(
                (item, index) => (
                  <div
                    key={index}
                    className={`tab-item relative text-secondary heading5 py-2 px-5 cursor-pointer duration-500 hover:text-black ${
                      activeTab === item.id ? "active" : ""
                    }`}
                    onClick={() => handleTabClick(item.id)}
                  >
                    {activeTab === item.id && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-2xl bg-white"
                      ></motion.div>
                    )}
                    <span className="relative heading5 z-[1]">{t(`slider.collections.${item.key}`)}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="list-product hide-product-sold  grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
            {products.slice(start, limit).map((prd, index) => (
              <Product key={index} data={prd} type="grid" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TabFeatures;
