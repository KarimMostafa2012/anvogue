'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
    props: string;
}

const Benefit: React.FC<Props> = ({ props }) => {
    const { t } = useTranslation();
    
    return (
        <>
            <div className="container">
                <div className={`benefit-block ${props}`}>
                    <div className="list-benefit grid items-start lg:grid-cols-4 grid-cols-2 gap-[30px]">
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i className="icon-phone-call lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">{t('benefit.customerService.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{t('benefit.customerService.description')}</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i className="icon-return lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">{t('benefit.moneyBack.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{t('benefit.moneyBack.description')}</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i className="icon-guarantee lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">{t('benefit.guarantee.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{t('benefit.guarantee.description')}</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i className="icon-delivery-truck lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">{t('benefit.shipping.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{t('benefit.shipping.description')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Benefit