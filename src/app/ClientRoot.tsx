import { ClientProviders } from './ClientProvider'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const ModalCart = dynamic(
    () => import('@/components/Modal/ModalCart')
        .then(mod => mod.default)
        .catch(() => function ModalCartError() {
            return <div className="loading-modal">Failed to load cart</div>;
        }),
    {
        ssr: false,
        loading: () => <div className="loading-modal">Loading cart...</div>
    }
);

const ModalWishlist = dynamic(
    () => import('@/components/Modal/ModalWishlist')
        .then(mod => mod.default)
        .catch(() => function ModalWishlistError() {
            return <div className="loading-modal">Failed to load wishlist</div>;
        }),
    {
        ssr: false,
        loading: () => <div className="loading-modal">Loading wishlist...</div>
    }
);

const ModalSearch = dynamic(
    () => import('@/components/Modal/ModalSearch')
        .then(mod => mod.default)
        .catch(() => function ModalSearchError() {
            return <div className="loading-modal">Failed to load search</div>;
        }),
    {
        ssr: false,
        loading: () => <div className="loading-modal">Loading search...</div>
    }
);

const ModalQuickview = dynamic(
    () => import('@/components/Modal/ModalQuickview')
        .then(mod => mod.default)
        .catch(() => function ModalQuickviewError() {
            return <div className="loading-modal">Failed to load quickview</div>;
        }),
    {
        ssr: false,
        loading: () => <div className="loading-modal">Loading quickview...</div>
    }
);

const ModalCompare = dynamic(
    () => import('@/components/Modal/ModalCompare')
        .then(mod => mod.default)
        .catch(() => function ModalCompareError() {
            return <div className="loading-modal">Failed to load compare</div>;
        }),
    {
        ssr: false,
        loading: () => <div className="loading-modal">Loading compare...</div>
    }
);

export default function ClientRoot({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClientProviders>
            {children}
            <Suspense fallback={<div className="loading-modal">Loading modals...</div>}>
                <ModalCart />
                <ModalWishlist />
                <ModalSearch />
                <ModalQuickview />
                <ModalCompare />
            </Suspense>
        </ClientProviders>
    )
}