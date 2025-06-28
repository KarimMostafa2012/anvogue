"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Product from "../Product/Product";
import { ProductType } from "@/type/ProductType";
import { countdownTime } from "@/store/countdownTime";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getOfferProducts } from "@/redux/slices/productSlice";
import { useTranslation } from 'react-i18next';

interface Props {
  start: number;
  limit: number;
}

const Deal: React.FC<Props> = ({ start, limit }) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const dispatch = useDispatch<AppDispatch>();
  const { products, count, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    // Initialize with current time on client only
    setTimeLeft(countdownTime("2025-5-31"));

    const timer = setInterval(() => {
      setTimeLeft(countdownTime("2025-5-31"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // console.log("Fetching with params:", params);
    dispatch(getOfferProducts({ params: { lang: "en", has_offer: true } }));
  }, [dispatch]);

  return (
    <>
      <div className="tab-features-block md:pt-20 pt-10">
        <div className="container">
          <div className="heading flex items-center justify-between gap-5 flex-wrap">
            <div className="left flex items-center gap-6 gap-y-3 flex-wrap">
              <div className="heading3">{t("Deals of the day")}</div>
            </div>
            <Link
              href={"/shop/?has_offer=true"}
              className="text-button pb-1 border-b-2 border-black"
            >
              {t("View All Deals")}
            </Link>
          </div>

          <div className="list-product show-product-sold grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
            {products.slice(start, limit).map((prd, index) => (
              <Product key={index} data={prd} type="grid" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Deal;
