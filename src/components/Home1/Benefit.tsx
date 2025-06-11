'use client'

import React from 'react'
import { useTranslation } from 'next-i18next'

interface Props {
    className?: string;
}

const Benefit: React.FC<Props> = ({ className = '' }) => {
    const { t } = useTranslation();
    
    // Helper function to ensure string output
    const getTranslation = (key: string): string => {
        const translation = t(key);
        return typeof translation === 'string' ? translation : String(translation);
    };
    
    return (
        <>
            <div className="container">
                <div className={`benefit-block ${className}`}>
                    <div className="list-benefit grid items-start lg:grid-cols-4 grid-cols-2 gap-[30px]">
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i className="icon-phone-call lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">{getTranslation('benefit.customerService.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{getTranslation('benefit.customerService.description')}</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i className="icon-return lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">{getTranslation('benefit.moneyBack.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{getTranslation('benefit.moneyBack.description')}</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i className="icon-guarantee lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">{getTranslation('benefit.guarantee.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{getTranslation('benefit.guarantee.description')}</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i className="icon-delivery-truck lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">{getTranslation('benefit.shipping.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{getTranslation('benefit.shipping.description')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Benefit
