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
import { Provider, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';

const GlobalProviderContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const currentLanguage = useSelector((state: RootState) => state.language);

    useEffect(() => {
        // Set document direction based on language
        if (currentLanguage === 'ar' || currentLanguage === 'ckb') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = currentLanguage;
        }
    }, [currentLanguage]);

    return (
        <div dir={currentLanguage === 'ar' || currentLanguage === 'ckb' ? 'rtl' : 'ltr'} lang={currentLanguage}>
            <I18nextProvider i18n={i18n}>
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
            </I18nextProvider>
        </div>
    );
};

// This should be used at the root of your application
export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Provider store={store}>
            <GlobalProviderContent>
                {children}
            </GlobalProviderContent>
        </Provider>
    );
};

export default GlobalProvider;