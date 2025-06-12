'use client'

import React, { Component } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/effect-fade';
import { useTranslation } from 'react-i18next';

const SliderNine = () => {
    const { t } = useTranslation();

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
                            className='h-full relative rounded-2xl overflow-hidden'
                        // autoplay={{
                        //     delay: 4000,
                        // }}
                        >
                            <SwiperSlide>
                                <div className="slider-item h-full w-full flex items-center bg-surface relative">
                                    <div className="text-content md:ps-16 ps-5 basis-1/2">
                                        <div className="text-sub-display">{t("Sale! Up To 50% Off!")}</div>
                                        <div className="heading1 md:mt-5 mt-2">{t("Step into a World of Style")}</div>
                                        <Link href='/shop/breadcrumb-img' className="button-main md:mt-8 mt-3">{t("Shop Now")}</Link>
                                    </div>
                                    <div className="sub-img absolute xl:w-[33%] sm:w-[38%] w-[60%] ltr:xl:right-[100px] ltr:sm:right-[20px] ltr:-right-5 rtl:xl:left-[100px] rtl:sm:left[20xpx] rtl:-left-5 bottom-0">
                                        <Image
                                            src={'/images/slider/bg9-1.png'}
                                            width={2000}
                                            height={1936}
                                            alt='bg9-1'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="slider-item h-full w-full flex items-center bg-[#F2E9E9] relative">
                                    <div className="text-content md:ps-16 ps-5 basis-1/2">
                                        <div className="text-sub-display">{t("Sale! Up To 50% Off!")}</div>
                                        <div className="heading1 md:mt-5 mt-2">{t("Unveiling Fashion's Finest")}</div>
                                        <Link href='/shop/breadcrumb-img' className="button-main md:mt-8 mt-3">{t("Shop Now")}</Link>
                                    </div>
                                    <div className="sub-img absolute xl:w-[35%] sm:w-[40%] w-[62%] ltr:xl:right-[100px] ltr:sm:right-[20px] ltr:-right-5 rtl:xl:left-[100px] rtl:sm:left[20xpx] rtl:-left-5 bottom-0">
                                        <Image
                                            src={'/images/slider/bg9-2.png'}
                                            width={2000}
                                            height={1936}
                                            alt='bg9-2'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="slider-item h-full w-full flex items-center bg-[#E4EADD] relative">
                                    <div className="text-content md:ps-16 ps-5 basis-1/2">
                                        <div className="text-sub-display">{t("Sale! Up To 50% Off!")}</div>
                                        <div className="heading1 md:mt-5 mt-2">{t("Unleash Your Unique Style")}</div>
                                        <Link href='/shop/breadcrumb-img' className="button-main md:mt-8 mt-3">{t("Shop Now")}</Link>
                                    </div>
                                    <div className="sub-img absolute xl:w-[29%] sm:w-[33%] w-[46%] ltr:xl:right-[100px] ltr:sm:right-[20px] ltr:-right-5 rtl:xl:left-[100px] rtl:sm:left[20xpx] rtl:-left-5 bottom-0 rtl:xl:left-[80px] rtl:sm:left-[20px] rtl:-left-3">
                                        <Image
                                            src={'/images/slider/bg9-3.png'}
                                            width={2000}
                                            height={2000}
                                            alt='bg9-3'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SliderNine