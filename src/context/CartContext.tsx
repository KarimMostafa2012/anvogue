"use client";

import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { ProductType } from "@/type/ProductType";

interface CartItem extends ProductType {
  quantity: number;
  selectedSize: number | undefined;
  selectedColor: string | undefined;
  cartItemId: string;
  image: string;
  name: string;
  price: number | string;
  new_price?: number; // Added for offer price
}

interface CartState {
  cartArray: CartItem[];
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | {
      type: "UPDATE_CART";
      payload: {
        itemId: string;
        quantity: number;
        selectedSize: number | undefined;
        selectedColor: string | undefined;
      };
    }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

interface CartContextProps {
  cartState: CartState;
  addToCart: (
    item: ProductType,
    selectedColor: string,
    quantity?: number
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCart: (
    itemId: string,
    quantity: number,
    selectedColor: string | undefined,
    selectedSize?: number | undefined
  ) => Promise<void>;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cartArray: [...state.cartArray, action.payload],
        error: null,
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartArray: state.cartArray.filter((item) => item.id !== action.payload),
        error: null,
      };
    case "UPDATE_CART":
      return {
        ...state,
        cartArray: state.cartArray.map((item) =>
          item.id === action.payload.itemId
            ? {
                ...item,
                quantity: action.payload.quantity,
                selectedSize: action.payload.selectedSize,
                selectedColor: action.payload.selectedColor,
              }
            : item
        ),
        error: null,
      };
    case "LOAD_CART":
      return {
        ...state,
        cartArray: action.payload,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    cartArray: [],
    isLoading: false,
    error: null,
  });

  // Load cart on initial render
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch("https://api.malalshammobel.com/cart/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            window.localStorage.getItem("accessToken")
              ? window.localStorage.getItem("accessToken")
              : window.sessionStorage.getItem("accessToken")
          }`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to load cart");
      }
      const data = await response.json();

      // Transform API response to ensure required fields
      const transformedCartItems = data.map((item: any) => ({
        ...item.product, // Spread all product details
        quantity: item.product.quantity,
        selectedSize: item.size,
        selectedColor: item.color,
        cartItemId: item.id,
        image: item.image || item.product.images?.[0]?.img || "",
        name: item.product.name,
        price: item.product.price,
        new_price: item.product.new_price,
      }));

      dispatch({ type: "LOAD_CART", payload: transformedCartItems });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Failed to load cart",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addToCart = async (
    item: ProductType,
    selectedColor: string,
    quantity?: number
  ) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch("https://api.malalshammobel.com/cart/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            window.localStorage.getItem("accessToken")
              ? window.localStorage.getItem("accessToken")
              : window.sessionStorage.getItem("accessToken")
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: item.id,
          quantity: quantity == undefined ? 1 : quantity,
          color: selectedColor || "",
          image: item.images[0].img,
        }),
      });

      if (!response.ok) {
        if (Number(response.status) == 401) {
          window.localStorage.removeItem("accessToken");
          window.sessionStorage.removeItem("accessToken");
          window.localStorage.removeItem("refreshToken");
          window.sessionStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        throw new Error("Failed to add item to cart");
      }

      const newCartItem = await response.json();

      // Create the cart item with all required fields
      const cartItemPayload: CartItem = {
        ...item,
        quantity: quantity == undefined ? 1 : quantity,
        selectedSize: item.size,
        selectedColor: selectedColor || "",
        cartItemId: newCartItem.id,
        image: item.images[0].img,
        name: item.name,
        price: item.price,
        new_price: item.new_price,
      };

      dispatch({
        type: "ADD_TO_CART",
        payload: cartItemPayload,
      });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to add item to cart",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // ... (keep removeFromCart and updateCart functions the same as before)
  const removeFromCart = async (itemId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const itemToRemove = cartState.cartArray.find(
        (item) => item.cartItemId === itemId
      );
      if (!itemToRemove?.cartItemId) throw new Error("Cart item not found");

      const response = await fetch(
        `https://api.malalshammobel.com/cart/${itemId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${
              window.localStorage.getItem("accessToken")
                ? window.localStorage.getItem("accessToken")
                : window.sessionStorage.getItem("accessToken")
            }`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (Number(response.status) == 401) {
          window.localStorage.removeItem("accessToken");
          window.sessionStorage.removeItem("accessToken");
          window.localStorage.removeItem("refreshToken");
          window.sessionStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        throw new Error("Failed to remove item from cart");
      }

      dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to remove item from cart",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
      loadCart();
    }
  };

  const updateCart = async (
    itemId: string,
    quantity: number,
    selectedColor: string | undefined,
    selectedSize?: number | undefined
  ) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const itemToUpdate = cartState.cartArray.find(
        (item) => item.id === itemId
      );
      if (!itemToUpdate?.cartItemId) throw new Error("Cart item not found");

      const response = await fetch(
        `https://api.malalshammobel.com/cart/${itemToUpdate.cartItemId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${
              window.localStorage.getItem("accessToken")
                ? window.localStorage.getItem("accessToken")
                : window.sessionStorage.getItem("accessToken")
            }`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity,
            color: selectedColor,
            size: selectedSize,
          }),
        }
      );

      if (!response.ok) {
        if (Number(response.status) == 401) {
          window.localStorage.removeItem("accessToken");
          window.sessionStorage.removeItem("accessToken");
          window.localStorage.removeItem("refreshToken");
          window.sessionStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        throw new Error("Failed to update cart item");
      }

      dispatch({
        type: "UPDATE_CART",
        payload: {
          itemId,
          quantity,
          selectedSize,
          selectedColor,
        },
      });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to update cart item",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartState,
        addToCart,
        removeFromCart,
        updateCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
