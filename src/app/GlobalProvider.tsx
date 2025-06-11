'use client';

import React from 'react'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/utils/i18n'

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </Provider>
  )
}

export default GlobalProvider