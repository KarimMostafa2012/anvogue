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
                    <div className="slider-main lg:pl-5 h-full w-full">
                        <Swiper
                            spaceBetween={0}
                            slidesPerView={1}
                            loop={true}
                            pagination={{ clickable: true }}
                            modules={[Pagination, Autoplay]}
                            className='h-full relative rounded-2xl overflow-hidden'
                            autoplay={{
                                delay: 4000,
                            }}
                        >
                            <SwiperSlide>
                                <div className="slider-item h-full w-full flex items-center bg-surface relative">
                                    <div className="text-content md:pl-16 pl-5 basis-1/2">
                                        <div className="text-sub-display">{t('slider.sale')}</div>
                                        <div className="heading1 md:mt-5 mt-2">{t('slider.collections.fashion')}</div>
                                        <Link href='/shop/breadcrumb-img' className="button-main md:mt-8 mt-3">{t('slider.shopNow')}</Link>
                                    </div>
                                    <div className="sub-img absolute xl:w-[33%] sm:w-[38%] w-[60%] xl:right-[100px] sm:right-[20px] -right-5 bottom-0">
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
                                    <div className="text-content md:pl-16 pl-5 basis-1/2">
                                        <div className="text-sub-display">{t('slider.sale')}</div>
                                        <div className="heading1 md:mt-5 mt-2">{t('slider.collections.newSeason')}</div>
                                        <Link href='/shop/breadcrumb-img' className="button-main md:mt-8 mt-3">{t('slider.shopNow')}</Link>
                                    </div>
                                    <div className="sub-img absolute xl:w-[35%] sm:w-[40%] w-[62%] xl:right-[80px] sm:right-[20px] -right-5 bottom-0">
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
                                    <div className="text-content md:pl-16 pl-5 basis-1/2">
                                        <div className="text-sub-display">{t('slider.sale')}</div>
                                        <div className="heading1 md:mt-5 mt-2">{t('slider.collections.stylish')}</div>
                                        <Link href='/shop/breadcrumb-img' className="button-main md:mt-8 mt-3">{t('slider.shopNow')}</Link>
                                    </div>
                                    <div className="sub-img absolute xl:w-[29%] sm:w-[33%] w-[46%] xl:right-[80px] sm:right-[20px] -right-3 bottom-0">
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