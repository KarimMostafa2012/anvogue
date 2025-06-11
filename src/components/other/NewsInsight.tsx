"use client"
import React from 'react'
import { BlogType } from '@/type/BlogType'
import { useTranslation } from 'next-i18next'

interface Props {
    data: Array<BlogType>;
    start: number;
    limit: number;
}

const NewsInsight = ({ data, start, limit }: Props) => {
    const { t } = useTranslation();
    
    // Helper function to ensure string output
    const getTranslation = (key: string): string => {
        const translation = t(key);
        return typeof translation === 'string' ? translation : String(translation);
    };
    
    return (
        <>
            <div className="news-insight-block">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="menu-tab flex items-center justify-center gap-2 caption1 text-secondary">
                            <span>{getTranslation('newsInsight.trending')}</span>
                            <span className="w-1 h-1 rounded-full bg-secondary"></span>
                            <span>{getTranslation('newsInsight.latest')}</span>
                        </div>
                        <h2 className="heading3 mt-4">{getTranslation('newsInsight.title')}</h2>
                    </div>
                    <div className="list-news grid lg:grid-cols-3 md:grid-cols-2 gap-[30px] mt-10">
                        {data.slice(start, limit).map((prd, index) => (
                            <div key={index} className="news-item">
                                <div className="news-img block overflow-hidden rounded-2xl">
                                    <img
                                        src={prd.thumbImg}
                                        width={500}
                                        height={500}
                                        alt="news"
                                        className="w-full duration-500"
                                    />
                                </div>
                                <div className="news-content mt-6">
                                    <div className="heading6">{prd.title}</div>
                                    <div className="body1 text-secondary mt-2">{prd.shortDesc}</div>
                                    <div className="date flex items-center gap-2 mt-4">
                                        <i className="icon-calendar text-lg"></i>
                                        <span className="caption1 text-secondary">{prd.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewsInsight