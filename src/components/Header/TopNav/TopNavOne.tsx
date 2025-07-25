'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { changeLanguage } from '@/redux/slices/languageSlice';

interface Props {
    props: string;
}

const TopNavOne: React.FC<Props> = ({ props }) => {
    const [isOpenLanguage, setIsOpenLanguage] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState<string>("English")
    const dispatch = useDispatch<AppDispatch>()
    const handleChangeLanguage = (language: string) => {
        dispatch(changeLanguage(language));
    };
    const currentLanguage = useSelector((state: RootState) => state.language);
    const { t } = useTranslation();
    const languages = [
        { key: "ar", name: "العربية" },
        { key: "en", name: "English" },
        { key: "de", name: "Deutsch" },
        { key: "ckb", name: "کوردی" },
        { key: "uk", name: "український" },
    ];
    useEffect(() => {
        setSelectedLanguage(languages.find(item => item.key === currentLanguage)?.name || "Deutsch")
    }, [languages, currentLanguage])

    return (
        <>
            <div className={`top-nav md:h-[44px] h-[30px] ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="top-nav-main flex justify-between max-md:justify-center h-full">
                        <div className="left-content flex items-center gap-5 max-md:hidden">
                            <div
                                className="choose-type choose-language flex items-center gap-1.5"
                                onClick={() => {
                                    setIsOpenLanguage(!isOpenLanguage)
                                }}
                            >
                                <div className="select relative">
                                    <p className="selected caption2 text-white">{selectedLanguage}</p>
                                    <ul className={`list-option bg-white ${isOpenLanguage ? 'open' : ''}`}>
                                        {
                                            languages.map((item, index) => (
                                                <li key={index} className="caption2" onClick={() => { handleChangeLanguage(item.key); setSelectedLanguage(item.name) }}>{item.name}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <Icon.CaretDown size={12} color='#fff' />
                            </div>
                        </div>
                        <div className="text-center text-button-uppercase text-white flex items-center">
                            {t('topNav.promoCode')}
                        </div>
                        <div className="right-content flex items-center gap-5 max-md:hidden">
                            <Link href={'https://www.facebook.com/'} target='_blank'>
                                <i className="icon-facebook text-white"></i>
                            </Link>
                            <Link href={'https://www.instagram.com/'} target='_blank'>
                                <i className="icon-instagram text-white"></i>
                            </Link>
                            <Link href={'https://www.youtube.com/'} target='_blank'>
                                <i className="icon-youtube text-white"></i>
                            </Link>
                            <Link href={'https://twitter.com/'} target='_blank'>
                                <i className="icon-twitter text-white"></i>
                            </Link>
                            <Link href={'https://pinterest.com/'} target='_blank'>
                                <i className="icon-pinterest text-white"></i>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default TopNavOne