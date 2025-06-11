"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { countdownTime } from "@/store/countdownTime";
import { useTranslation } from "next-i18next";

const ComingSoon = () => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(countdownTime("2025-5-31"));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownTime("2025-5-31"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="coming-soon relative w-screen h-screen">
        <Image
          src={"/images/other/bg-coming-soon.webp"}
          width={4000}
          height={3000}
          alt="bg"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="container w-full h-full">
          <div className="text-content w-full h-full flex items-center justify-center relative">
            <div className="content-main flex flex-col items-center lg:w-1/2 sm:w-3/5 w-full">
              <div>
                <Image
                  src="/images/logo.png"
                  width={120}
                  height={120}
                  alt="logo"
                  className="w-[120px] mb-2"
                />
              </div>
              <div className="text-display">{t('comingSoon.title')}</div>
              <div className="countdown-time flex items-center gap-5 lg:mt-[60px] md:mt-10 mt-6">
                <div className="item flex flex-col items-center">
                  <div className="days time heading1">
                    {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}
                  </div>
                  <div className="text-button-uppercase font-medium">{t('comingSoon.days')}</div>
                </div>
                <span className="heading4">:</span>
                <div className="item flex flex-col items-center">
                  <div className="hours time heading1">
                    {timeLeft.hours < 10
                      ? `0${timeLeft.hours}`
                      : timeLeft.hours}
                  </div>
                  <div className="text-button-uppercase font-medium">{t('comingSoon.hours')}</div>
                </div>
                <span className="heading4">:</span>
                <div className="item flex flex-col items-center">
                  <div className="minutes time heading1">
                    {timeLeft.minutes < 10
                      ? `0${timeLeft.minutes}`
                      : timeLeft.minutes}
                  </div>
                  <div className="text-button-uppercase font-medium">
                    {t('comingSoon.minutes')}
                  </div>
                </div>
                <span className="heading4">:</span>
                <div className="item flex flex-col items-center">
                  <div className="seconds time heading1">
                    {timeLeft.seconds < 10
                      ? `0${timeLeft.seconds}`
                      : timeLeft.seconds}
                  </div>
                  <div className="text-button-uppercase font-medium">
                    {t('comingSoon.seconds')}
                  </div>
                </div>
              </div>
              <div className="list-link flex items-center gap-6 justify-center mt-6">
                <Link
                  href={"https://www.facebook.com/memo1119111"}
                  target="_blank"
                >
                  <div className="icon-facebook text-xl"></div>
                </Link>
                <Link
                  href={"https://www.instagram.com/mal_al_sham_mobel/?g=5"}
                  target="_blank"
                >
                  <div className="icon-instagram text-xl"></div>
                </Link>
                <Link
                  href={"https://www.tiktok.com/@malalshammobel"}
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
