"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface bannerType {
  id: number;
  link: string;
  image: string;
  name: string;
}

const Banner = () => {
  const { t } = useTranslation();
  const [banners, setBanners] = useState<bannerType[]>();
  const currentLanguage = useSelector((state: RootState) => state.language);

  useEffect(() => {
    fetch(
      `https://api.malalshammobel.com/home/fixed-slider/?lang=${currentLanguage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          console.error(
            `HTTP error! Status: ${response.status}, Text: ${response.statusText}`
          );
        } else {
          console.log("banner okay", response);
        }
        return response.json();
      })
      .then((data) => {
        setBanners(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [currentLanguage]);

  return (
    <>
      <div className="banner-block md:pt-20 pt-10">
        <div className="container">
        {
            (banners != undefined && banners?.length > 0) && (
              <div className="list-banner grid lg:grid-cols-3 md:grid-cols-2 lg:gap-[30px] gap-[20px]">
                {banners?.map((banner) => {
                  return (
                    <Link
                      key={banner.id}
                      href={banner.link || ""}
                      className="banner-item relative block duration-500"
                    >
                      <div className="banner-img w-full rounded-2xl overflow-hidden">
                        <Image
                          src={banner.image || ""}
                          width={600}
                          height={400}
                          alt="bg-img"
                          className="w-full duration-500"
                        />
                      </div>
                      <div className="banner-content absolute left-[30px] bottom-[24px] ">
                        <div className="heading6">{banner.name}</div>
                        <div className="caption1 font-semibold text-black relative inline-block pb-1 border-b-2 border-black duration-500 mt-2">
                          {t("Shop Now")}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
                )
            }
        </div>
      </div>
    </>
  );
};

export default Banner;
