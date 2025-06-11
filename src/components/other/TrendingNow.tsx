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
import { useTranslation } from 'react-i18next';
import { Category } from '@/types/categories';
import axios from 'axios';
import { baseUrl } from '@/utils/constants';

const TrendingNow = () => {
  const { t } = useTranslation();
  const currentLanguage = useSelector((state: RootState) => state.language);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/products/category/`, {
          params: {
            lang: currentLanguage
          },
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [currentLanguage]);

  const handleTypeClick = (type: string) => {
    router.push(`/shop/?category=${type}`);
  };

  return (
    <>
      <div className="trending-block style-nine md:pt-20 pt-10">
        <div className="container">
          <div className="heading3 text-center">{t('slider.collections.trending')}</div>
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
              {categories.map((category) => {
                return (
                  <SwiperSlide key={category.id} className="py-1">
                    <div
                      className="trending-item block relative cursor-pointer"
                      onClick={() => handleTypeClick("t-shirt")}
                    >
                      <div className="bg-img rounded-2xl overflow-hidden shadow">
                        <Image
                          src={category.icon?.icon || ""}
                          width={1000}
                          height={1000}
                          alt={category.name}
                          priority={true}
                          className="w-full"
                        />
                      </div>
                      <div className="trending-name shadow-md bg-white absolute bottom-5 left-1/2 -translate-x-1/2 w-[140px] h-10 rounded-xl flex items-center justify-center duration-500 hover:bg-black hover:text-white">
                        <span className="heading6">{category.name}</span>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrendingNow;
