'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';


interface homeCat {
    id: number;
    name: string;
    icon: {
        id: number;
        icon: string;
    }
}

const TrendingNow = () => {
    const router = useRouter()
    const { t } = useTranslation();
    const currentLanguage = useSelector((state: RootState) => state.language);
    const [cat, setCat] = useState<homeCat[]>()

    const handleTypeClick = (type: string) => {
        router.push(`/shop/breadcrumb1?type=${type}`);
    };
    useEffect(() => {
        fetch(`https://api.malalshammobel.com/products/category/?lang=${currentLanguage}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    console.log(response)
                }
                return response.json();
            })
            .then((data) => {
                setCat(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [])

    return (
        <>
            <div className="trending-block style-nine md:pt-20 pt-10">
                <div className="container">
                    <div className="heading3 text-center">{t("Trending Right Now")}
                    </div>
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
                            className='h-full'
                        >
                            {
                                cat?.map((c) => {
                                    return (

                                        <SwiperSlide key={c.id}>
                                            <div className="trending-item block relative cursor-pointer py-2">
                                                <div className="bg-img rounded-2xl overflow-hidden shadow-md">
                                                    <Image
                                                        src={String(c.icon.icon)}
                                                        width={1000}
                                                        height={1000}
                                                        alt={c.name}
                                                        priority={true}
                                                        className='w-full'
                                                    />
                                                </div>
                                                <div className="trending-name bg-white absolute bottom-5 left-1/2 -translate-x-1/2 w-[140px] h-10 rounded-xl flex items-center justify-center duration-500 hover:bg-black hover:text-white shadow">
                                                    <span className='heading6'>{c.name}</span>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    )
                                })
                            }
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TrendingNow