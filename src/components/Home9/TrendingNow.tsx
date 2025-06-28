"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/bundle";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface HomeCategory {
  id: number;
  category: {
    id: number;
    name: {
      de: string;
      en: string;
      ar: string;
      ckb: string;
      uk: string;
    };
  };
  image: string | null;
}
type LanguageCode = "en" | "ar" | "de" | "ckb" | "uk";

interface LanguageState {
  language: LanguageCode;
  // ... other state properties
}

const TrendingNow = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const currentLanguage = useSelector((state: LanguageState) => state.language);
  const [categories, setCategories] = useState<HomeCategory[]>([]);

  const handleTypeClick = (type: string) => {
    router.push(`/shop?category=${type}`);
  };

  useEffect(() => {
    fetch(`https://api.malalshammobel.com/home/home-category/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          console.log(response);
        }
        return response.json();
      })
      .then((data) => {
        console.log("home cat");
        console.log(data);
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [currentLanguage]);

  return (
    <div className="trending-now-block py-10">
      <div className="container">
        <div className="heading3 text-center mb-10">
          {t("home.trendingNow")}
        </div>
        <div className="list-trending relative">
          <style jsx global>{`
            .swiper-button-next,
            .swiper-button-prev {
              width: 40px !important;
              height: 40px !important;
              background: #000000 !important;
              border-radius: 50% !important;
              color: #ffffff !important;
              display: flex !important;
            }
            .swiper-button-next:after,
            .swiper-button-prev:after {
              font-size: 20px !important;
            }
            .swiper-button-next:hover,
            .swiper-button-prev:hover {
              background: #333333 !important;
            }
            .swiper-button-disabled {
              opacity: 0.35 !important;
              cursor: auto !important;
              pointer-events: none !important;
            }
          `}</style>
          <Swiper
            spaceBetween={6}
            slidesPerView={1}
            navigation={true}
            modules={[Navigation, Autoplay]}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
            className="swiper-trending"
          >
            {categories.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="trending-item bg-surface rounded-2xl p-4 cursor-pointer"
                  onClick={() =>
                    handleTypeClick(item.category.name[currentLanguage])
                  }
                >
                  <div className="bg-img w-full aspect-sq uare rounded-xl overflow-hidden mb-4">
                    <Image
                      src={item.image || "/images/logo.png"}
                      width={300}
                      height={300}
                      alt={item.category.name[currentLanguage]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="name text-button text-center">
                    {item.category.name[currentLanguage]}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default TrendingNow;
