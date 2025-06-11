'use client';

import React, { useEffect } from 'react'
import { CartProvider } from '@/context/CartContext'
import { ModalCartProvider } from '@/context/ModalCartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { ModalWishlistProvider } from '@/context/ModalWishlistContext'
import { CompareProvider } from '@/context/CompareContext'
import { ModalCompareProvider } from '@/context/ModalCompareContext'
import { ModalSearchProvider } from '@/context/ModalSearchContext'
import { ModalQuickviewProvider } from '@/context/ModalQuickviewContext'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

export const ClientProviders = ({ children }: { children: React.ReactNode }) => {
    const currentLanguage = useSelector((state: RootState) => state.language)

    useEffect(() => {
        // Set document direction based on language
        if (currentLanguage === 'ar' || currentLanguage === 'ckb') {
            document.documentElement.dir = 'rtl'
            document.documentElement.lang = 'ar'
        } else {
            document.documentElement.dir = 'ltr'
            document.documentElement.lang = currentLanguage
        }
    }, [currentLanguage])

    return (
        <div dir={currentLanguage === 'ar' || currentLanguage === 'ckb' ? 'rtl' : 'ltr'}
            lang={currentLanguage}>
            <CartProvider>
                <ModalCartProvider>
                    <WishlistProvider>
                        <ModalWishlistProvider>
                            <CompareProvider>
                                <ModalCompareProvider>
                                    <ModalSearchProvider>
                                        <ModalQuickviewProvider>
                                            {children}
                                        </ModalQuickviewProvider>
                                    </ModalSearchProvider>
                                </ModalCompareProvider>
                            </CompareProvider>
                        </ModalWishlistProvider>
                    </WishlistProvider>
                </ModalCartProvider>
            </CartProvider>
        </div>
    )
}