'use client'

import React from 'react'
import GlobalProvider from './GlobalProvider'
import ClientRoot from './ClientRoot'
import ClientWrapper from './ClientWrapper'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalProvider>
      <ClientRoot>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </ClientRoot>
    </GlobalProvider>
  )
} 