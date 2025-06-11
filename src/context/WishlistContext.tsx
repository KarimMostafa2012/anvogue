'use client'

import React, { createContext, useContext, useState, useReducer, useEffect, useCallback } from 'react';
import { ProductType } from '@/type/ProductType';

export interface WishlistItem {
    id: number;
    product: ProductType;
}

interface WishlistState {
    wishlistArray: WishlistItem[];
    loading: boolean;
    error: string | null;
}

type WishlistAction =
    | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
    | { type: 'REMOVE_FROM_WISHLIST'; payload: number }  // Changed to number to match id type
    | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

interface WishlistContextProps {
    wishlistState: WishlistState;
    addToWishlist: (item: ProductType) => Promise<void>;
    removeFromWishlist: (itemId: number) => Promise<void>;  // Changed to number
    fetchWishlist: () => Promise<void>;
    isInWishlist: (itemId: number) => boolean;  // Changed to number
}

const WishlistContext = createContext<WishlistContextProps | undefined>(undefined);

const WishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
    switch (action.type) {
        case 'ADD_TO_WISHLIST':
            return {
                ...state,
                wishlistArray: [...state.wishlistArray, action.payload],
                error: null
            };
        case 'REMOVE_FROM_WISHLIST':
            return {
                ...state,
                wishlistArray: state.wishlistArray.filter((item) => item.id !== action.payload),
                error: null
            };
        case 'LOAD_WISHLIST':
            return {
                ...state,
                wishlistArray: action.payload,
                error: null
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        default:
            return state;
    }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlistState, dispatch] = useReducer(WishlistReducer, { 
        wishlistArray: [], 
        loading: false,
        error: null
    });

    const getAuthToken = () => {
        return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    };

    const fetchWishlist = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('https://api.malalshammobel.com/products/favorite/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch wishlist');
            }

            const data: WishlistItem[] = await response.json();
            dispatch({ type: 'LOAD_WISHLIST', payload: data });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch wishlist' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [dispatch]);

    const addToWishlist = async (product: ProductType) => {
        console.log(product)
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('https://api.malalshammobel.com/products/favorite/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ product: product.id })
            });

            if (!response.ok) {
                throw new Error('Failed to add to wishlist');
            }

            // Assuming API returns the created favorite item
            const newFavorite: WishlistItem = await response.json();
            dispatch({ type: 'ADD_TO_WISHLIST', payload: newFavorite });
            fetchWishlist()
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to add to wishlist' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const removeFromWishlist = async (favoriteId: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`https://api.malalshammobel.com/products/favorite/${favoriteId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove from wishlist');
            }

            dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: favoriteId });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove from wishlist' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const isInWishlist = (productId: number) => {
        return wishlistState.wishlistArray.some(item => Number(item.product.id) === Number(productId));
    };

    // Load wishlist on component mount
    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    return (
        <WishlistContext.Provider value={{ 
            wishlistState, 
            addToWishlist, 
            removeFromWishlist,
            fetchWishlist,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};