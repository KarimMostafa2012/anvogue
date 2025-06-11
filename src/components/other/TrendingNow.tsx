"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslation } from 'next-i18next';

type Category = {
  id: number;
  icon?: {
    id: number;
    icon: string;
  };
  name: string
  translations: {
    en: {
      name: string;
    };
    ar: {
      name: string;
    };
    de: {
      name: string;
    };
    ckb: {
      name: string;
    };
    uk: {
      name: string;
    };
  };
};

const TrendingNow = () => {
  const { t } = useTranslation();
  const currentLanguage = useSelector((state: RootState) => state.language);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    setIsLoading(true);
    fetch(
      "https://api.malalshammobel.com/products/category/?lang=" +
        currentLanguage,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentLanguage, isMounted]);

  const handleTypeClick = (type: string) => {
    router.push(`/shop/?category=${type}`);
  };

  // Helper function to ensure string output
  const getTranslation = (key: string): string => {
    const translation = t(key);
    return typeof translation === 'string' ? translation : String(translation);
  };
  
  // Helper function to get category name in current language
  const getCategoryName = (category: Category): string => {
    if (!category?.translations) return 'Unnamed Category';
    return category.translations[currentLanguage as keyof typeof category.translations]?.name || 'Unnamed Category';
  };

  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="trending-block style-nine md:pt-20 pt-10">
        <div className="container">
          <div className="heading3 text-center">{getTranslation('slider.collections.trending')}</div>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="trending-block style-nine md:pt-20 pt-10">
        <div className="container">
          <div className="heading3 text-center">{getTranslation('slider.collections.trending')}</div>
          <div className="list-trending section-swiper-navigation style-small-border style-center style-outline md:mt-10 mt-6">
            <Swiper
              spaceBetween={12}
              slidesPerView={2}
              navigation
              loop={true}
              modules={[Navigation, Autoplay]}
              breakpoints={{
                576: {
                  slidesPerView: 3,
                  spaceBetween: 12,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                992: {
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
                1290: {
                  slidesPerView: 5,
                  spaceBetween: 30,
                },
              }}
              className="h-full"
            >
              {categories.map((category) => (
                <SwiperSlide key={category.id} className="py-1">
                  <div
                    className="trending-item block relative cursor-pointer"
                    onClick={() => handleTypeClick("t-shirt")}
                  >
                    <div className="bg-img rounded-2xl overflow-hidden shadow">
                      <Image
                        src={category.icon?.icon || "/images/placeholder.png"}
                        width={1000}
                        height={1000}
                        alt={getCategoryName(category)}
                        priority={true}
                        className="w-full"
                      />
                    </div>
                    <div className="trending-name shadow-md bg-white absolute bottom-5 left-1/2 -translate-x-1/2 w-[140px] h-10 rounded-xl flex items-center justify-center duration-500 hover:bg-black hover:text-white">
                      <span className="heading6">{getCategoryName(category)}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrendingNow;
