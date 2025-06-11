'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useTranslation } from 'next-i18next';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Dynamically import Swiper components
const Swiper = dynamic(() => import('swiper/react').then(mod => mod.Swiper), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-2xl" />
});

const SwiperSlide = dynamic(() => import('swiper/react').then(mod => mod.SwiperSlide), {
  ssr: false
});

const SliderNine = () => {
    const { t } = useTranslation();
    const [isMounted, setIsMounted] = useState(false);
    const [modules, setModules] = useState<any[]>([]);
    
    useEffect(() => {
        setIsMounted(true);
        // Import modules on client side
        Promise.all([
            import('swiper/modules').then(mod => mod.Pagination),
            import('swiper/modules').then(mod => mod.Autoplay)
        ]).then(([Pagination, Autoplay]) => {
            setModules([Pagination, Autoplay]);
        });
    }, []);
    
    // Helper function to ensure string output
    const getTranslation = (key: string): string => {
        const translation = t(key);
        return typeof translation === 'string' ? translation : String(translation);
    };

    if (!isMounted) {
        return (
            <div className="slider-block style-nine lg:h-[480px] md:h-[400px] sm:h-[320px] h-[280px] w-full">
                <div className="container lg:pt-5 flex justify-end h-full w-full">
                    <div className="slider-main lg:pl-5 h-full w-full">
                        <div className="h-full w-full bg-gray-100 animate-pulse rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }
    
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
                            modules={modules}
                            className='h-full relative rounded-2xl overflow-hidden'
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                        >
                            <SwiperSlide>
                                <div className="slider-item h-full w-full flex items-center bg-surface relative">
                                    <div className="text-content md:pl-16 pl-5 basis-1/2">
                                        <div className="text-sub-display">{getTranslation('slider.sale')}</div>
                                        <div className="heading1 md:mt-5 mt-2">{getTranslation('slider.collections.fashion')}</div>
                                        <Link href='/shop/breadcrumb-img' className="button-main md:mt-8 mt-3">{getTranslation('slider.shopNow')}</Link>
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
                                        <div className="text-sub-display">{getTranslation('slider.sale')}</div>
                                        <div className="heading1 md:mt-5 mt-2">{getTranslation('slider.collections.newSeason')}</div>
                                        <Link href='/shop/breadcrumb-img' className="button-main md:mt-8 mt-3">{getTranslation('slider.shopNow')}</Link>
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
                                        <div className="text-sub-display">{getTranslation('slider.sale')}</div>
                                        <div className="heading1 md:mt-5 mt-2">{getTranslation('slider.collections.stylish')}</div>
                                        <Link href='/shop/breadcrumb-img' className="button-main md:mt-8 mt-3">{getTranslation('slider.shopNow')}</Link>
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