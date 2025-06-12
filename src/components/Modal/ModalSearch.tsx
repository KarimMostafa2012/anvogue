'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import productData from '@/data/Product.json'
import Product from '../Product/Product';
import { useModalSearchContext } from '@/context/ModalSearchContext'
import { useModalQuickviewContext } from '@/context/ModalQuickviewContext';

import { useTranslation } from 'react-i18next'
import { getAllProducts } from '@/redux/slices/productSlice'
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


const useAppDispatch = () => useDispatch<AppDispatch>();

const ModalSearch = () => {
    const { isModalOpen, closeModalSearch } = useModalSearchContext();
    const [searchKeyword, setSearchKeyword] = useState('');
    const router = useRouter()
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);

    // Get products from Redux store
    const products = useSelector((state: RootState) => state.products.products);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = {
                    lang: "en",
                    has_offer: true,
                }
                await dispatch(getAllProducts({ params }));
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [t, dispatch]);


    const handleSearch = (value: string) => {
        router.push(`/shop?product_name=${value}`)
        closeModalSearch()
        setSearchKeyword('')
    }

    return (
        <>
            <div className={`modal-search-block`} onClick={closeModalSearch}>
                <div
                    className={`modal-search-main md:p-10 p-6 rounded-[32px] ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="form-search relative">
                        <Icon.MagnifyingGlass
                            className='absolute heading5 ltr:right-6 rtl:left-6 top-1/2 -translate-y-1/2 cursor-pointer'
                            onClick={() => {
                                handleSearch(searchKeyword)
                            }}
                        />
                        <input
                            type="text"
                            placeholder='Searching...'
                            className='text-button-lg h-14 rounded-2xl border border-line w-full ps-6 pe-12'
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
                        />
                    </div>
                    <div className="list-recent mt-8">
                        <div className="heading6">Sale Products</div>
                        <div className="list-product pb-5 hide-product-sold grid xl:grid-cols-4 sm:grid-cols-2 gap-7 mt-4">
                            {products.slice(0, 4).map((product) => (
                                <Product key={product.id} data={product} type='grid' />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalSearch