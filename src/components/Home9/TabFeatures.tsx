'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Product from '../Product/Product'
import { ProductType } from '@/type/ProductType'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getNewArrivals, getOfferProducts, getBestSellers } from '@/redux/slices/productSlice'

interface Props {
    start: number;
    limit: number;
}
const useAppDispatch = () => useDispatch<AppDispatch>();

const TabFeatures: React.FC<Props> = ({ start, limit }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<string>('on sale')
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const currentLanguage = useSelector((state: RootState) => state.language);

    // Get products from Redux store
    const products = useSelector((state: RootState) => state.products.offerProducts);
    const newArrivals = useSelector((state: RootState) => state.products.newArrivals);
    const bestSellers = useSelector((state: RootState) => state.products.bestSellers);

    const handleTabClick = (item: string) => {
        setActiveTab(item)
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'on sale') {
                    const params = {
                        lang: currentLanguage,
                        has_offer: true,
                    }
                    await dispatch(getOfferProducts({ params }));
                } else if (activeTab === 'new arrivals') {
                    const params = {
                        lang: currentLanguage,
                    }
                    await dispatch(getNewArrivals({ params }));
                } else if (activeTab === 'best sellers') {
                    const params = {
                        lang: currentLanguage,
                    }
                    await dispatch(getBestSellers({ params }));
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab, dispatch, currentLanguage]);

    const getFilteredProducts = () => {
        if (activeTab === 'on sale') {
            return products;
        } else if (activeTab === 'new arrivals') {
            return newArrivals;
        } else if (activeTab === 'best sellers') {
            return bestSellers;
        }
        return [];
    }

    const filteredProducts: ProductType[] = getFilteredProducts();

    return (
        <>
            <div className="tab-features-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl">
                            {['best sellers', 'on sale', 'new arrivals'].map((item, index) => (
                                <div
                                    key={index}
                                    className={`tab-item relative text-secondary heading5 py-2 px-5 cursor-pointer duration-500 hover:text-black ${activeTab === item ? 'active' : ''}`}
                                    onClick={() => handleTabClick(item)}
                                >
                                    {activeTab === item && (
                                        <motion.div layoutId='active-pill' className='absolute inset-0 rounded-2xl bg-white'></motion.div>
                                    )}
                                    <span className='relative heading5 z-[1]'>
                                        {t(item)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : (
                        <div className="list-product hide-product-sold grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
                            {filteredProducts && filteredProducts.length > 0 ? (
                                filteredProducts.slice(start, limit).map((prd, index) => (
                                    <Product key={prd.id || index} data={prd} type='grid' />
                                ))
                            ) : (
                                <div className="col-span-4 text-center py-10">No products found</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default TabFeatures