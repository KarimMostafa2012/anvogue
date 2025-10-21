"use client";

import React, { Component, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/effect-fade";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface HomeCategory {
  title: string;
  sub_title: string;
  button_text: string;
  link: string;
  image: null | string;
  background_color: string;
  id: number;
}

const SliderNine = () => {
  const { t } = useTranslation();
  const currentLanguage = useSelector((state: RootState) => state.language);
  const [slides, setSlides] = useState<HomeCategory[]>([]);

  useEffect(() => {
    fetch(
      `https://api.malalshammobel.com/home/first-slider/?lang=${currentLanguage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          console.log(response);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setSlides(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [currentLanguage]);

  return (
    <>
      <div className="slider-block style-nine lg:h-[480px] md:h-[400px] sm:h-[320px] h-[280px] w-full">
        <div className="container lg:pt-5 flex justify-end h-full w-full">
          <div className="slider-main lg:ps-5 h-full w-full">
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              pagination={{ clickable: true }}
              modules={[Pagination, Autoplay]}
              className="h-full relative rounded-2xl overflow-hidden"
              autoplay={{
                delay: 4000,
              }}
            >
              {slides.map((slide) => {
                return (
                  <SwiperSlide key={slide.id}>
                    <div
                      className="slider-item h-full w-full flex items-center relative"
                      style={{
                        backgroundColor: slide?.background_color ? slide?.background_color : "#ffffff",
                      }}
                    >
                      <div className="text-content md:ps-16 ps-5 basis-1/2">
                        <div className="text-sub-display">
                          {slide.sub_title}
                        </div>
                        <div className="heading1 md:mt-5 mt-2">
                          {slide.title}
                        </div>
                        <Link
                          href="/shop"
                          className="button-main md:mt-8 mt-3"
                        >
                          {slide.button_text}
                        </Link>
                      </div>
                      <div className="sub-img absolute xl:w-[33%] sm:w-[38%] w-[60%] ltr:xl:right-[100px] ltr:sm:right-[20px] ltr:-right-5 rtl:xl:left-[100px] rtl:sm:left[20xpx] rtl:-left-5 bottom-[50%] transform translate-y-[50%]">
                        <Image
                          src={slide.image || ""}
                          width={2000}
                          height={1936}
                          alt="bg9-1"
                          priority={true}
                          className="w-full"
                        />
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

export default SliderNine;
