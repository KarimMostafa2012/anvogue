'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslation } from 'react-i18next';
import {
    getProductById,
    clearProduct,
} from "@/redux/slices/productSlice";

interface Props {
    productPage: string | null
    productId: string | number | null
}

const useAppDispatch = () => useDispatch<AppDispatch>();

const BreadcrumbProduct: React.FC<Props> = ({ productPage, productId }) => {
    const dispatch = useAppDispatch();
    const product = useSelector((state: RootState) => state.products.product);
    const loading = useSelector((state: RootState) => state.products.loading);
    const error = useSelector((state: RootState) => state.products.error);
    const router = useRouter()
    const { t } = useTranslation();

    useEffect(() => {
        if (productId) {
            dispatch(getProductById({ id: String(productId), lang: "en" }));
        }

        return () => {
            dispatch(clearProduct());
        };
    }, [productId, dispatch, t]);

    console.log(product)
    const handleDetailProduct = (newProductId: string | number) => {
        router.push(`/product/${productPage}?id=${newProductId}`);
    };

    if (loading) {
        return (
            <div className="breadcrumb-product">
                <div className="main bg-surface md:pt-[88px] pt-[70px] pb-[14px]">
                    <div className="container flex items-center justify-between flex-wrap gap-3">
                        <div className="skeleton h-6 w-64"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="breadcrumb-product">
                <div className="main bg-surface md:pt-[88px] pt-[70px] pb-[14px]">
                    <div className="container flex items-center justify-between flex-wrap gap-3">
                        <div className="text-error">{t('error.loading_product')}</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="breadcrumb-product">
            <div className="main bg-surface md:pt-[88px] pt-[70px] pb-[14px]">
                <div className="container flex items-center justify-between flex-wrap gap-3">
                    <div className="left flex items-center gap-1">
                        <Link href={'/'} className='caption1 text-secondary2 hover:underline'>
                            {t('breadcrumb.home')}
                        </Link>
                        <Icon.CaretRight size={12} className='text-secondary2' />
                        <Link href="/shop" className='caption1 text-secondary2 hover:underline'>
                            {t('breadcrumb.products')}
                        </Link>
                        <Icon.CaretRight size={12} className='text-secondary2' />
                        <div className='caption1 capitalize truncate max-w-[200px]'>
                            {product?.name || t('breadcrumb.loading')}
                        </div>
                    </div>

                    <div className="right flex items-center gap-3">
                        {productId && Number(productId) > 1 && (
                            <div
                                onClick={() => handleDetailProduct(Number(productId) - 1)}
                                className='flex items-center cursor-pointer text-secondary hover:text-black border-r border-line pe-3'
                                aria-label={t('aria.previous_product')}
                            >
                                <Icon.CaretCircleLeft className='text-2xl text-black' />
                                <span className='caption1 ps-1'>{t('button.previous_product')}</span>
                            </div>
                        )}

                        {productId && (
                            <div
                                onClick={() => handleDetailProduct(Number(productId) + 1)}
                                className='flex items-center cursor-pointer text-secondary hover:text-black'
                                aria-label={t('aria.next_product')}
                            >
                                <span className='caption1 pe-1'>{t('button.next_product')}</span>
                                <Icon.CaretCircleRight className='text-2xl text-black' />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BreadcrumbProduct