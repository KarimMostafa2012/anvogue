import { CartItem } from "@/types/cart";
import { baseUrl } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface GetCartRequest {
    token: string;
    params?: {
        lang: string;
    };
}
interface AddToCartRequest {
    token: string;
    body: {
        product: number;
        quantity: number;
        color?: string;
    };
}
interface RemoveFromCartRequest {
    token: string;
    id: string;
}

export const getCartItems = createAsyncThunk<CartItem[], GetCartRequest>(
    "cart/getCartItems",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get<CartItem[]>(`${baseUrl}/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Accept": "application/json"
                },
                params: params
            });
            return data;
        } catch (error) {
            console.error("Error fetching cart items:", error);
            return rejectWithValue("Failed to fetch cart items");
        }
    }
);

export const addItemToCart = createAsyncThunk<CartItem, AddToCartRequest>(
    "cart/addItemToCart",
    async ({ token, body }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post<CartItem>(`${baseUrl}/cart`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            return data;
        } catch (error) {
            console.error("Error adding item to cart:", error);
            return rejectWithValue("Failed to add item to cart");
        }
    }
);
export const removeItemFromCart = createAsyncThunk<null, RemoveFromCartRequest>(
    "cart/removeItemFromCart",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete<null>(`${baseUrl}/cart/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            return data;
        } catch (error) {
            console.error("Error adding item to cart:", error);
            return rejectWithValue("Failed to add item to cart");
        }
    }
);

export const updateItemsQuantityInCart = createAsyncThunk<CartItem, { token: string; id: string; quantity: number }>(
    "cart/updateItemsQuantityInCart",
    async ({ token, id, quantity }, { rejectWithValue }) => {
        try {
            const { data } = await axios.patch<CartItem>(`${baseUrl}/cart/${id}`, { quantity }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            return data;
        } catch (error) {
            console.error("Error updating item quantity in cart:", error);
            return rejectWithValue("Failed to update item quantity in cart");
        }
    }
);

interface InitialState {
    cartItems: CartItem[];
    totalQuantity: number;
    totalAmount: number;
    loading: boolean;
    error: string | null;
    message: string;
}

const initialState: InitialState = {
    cartItems: [],
    totalQuantity: 0,
    totalAmount: 0,
    loading: false,
    error: null,
    message: ""
};


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCartItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.cartItems = action.payload;
                state.totalQuantity = action.payload.reduce((total, item) => total + item.quantity, 0);
                state.totalAmount = action.payload.reduce((total, item) => total + item.price * item.quantity, 0);
                state.loading = false;
            })
            .addCase(getCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        // -----------------------------------------------------
        builder
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                const newItem = action.payload;
                state.cartItems.push(newItem);
                state.totalQuantity += newItem.quantity;
                state.totalAmount += newItem.price * newItem.quantity;
                state.loading = false;
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        // -----------------------------------------------------
        builder
            .addCase(removeItemFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                const removedItemId = action.meta.arg.id;
                const removedItem = state.cartItems.find(item => item.id === removedItemId);
                if (removedItem) {
                    state.cartItems = state.cartItems.filter(item => item.id !== removedItemId);
                    state.totalQuantity -= removedItem.quantity;
                    state.totalAmount -= removedItem.price * removedItem.quantity;
                }
                state.loading = false;
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        // -----------------------------------------------------
        builder
            .addCase(updateItemsQuantityInCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateItemsQuantityInCart.fulfilled, (state, action) => {
                const updatedItem = action.payload;
                const existingItemIndex = state.cartItems.findIndex(item => item.id === updatedItem.id);
                if (existingItemIndex !== -1) {
                    const existingItem = state.cartItems[existingItemIndex];
                    state.totalQuantity += updatedItem.quantity - existingItem.quantity;
                    state.totalAmount += (updatedItem.price * updatedItem.quantity) - (existingItem.price * existingItem.quantity);
                    state.cartItems[existingItemIndex] = updatedItem;
                }
                state.loading = false;
            })
            .addCase(updateItemsQuantityInCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default cartSlice.reducer;