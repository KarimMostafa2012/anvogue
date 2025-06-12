import { configureStore } from "@reduxjs/toolkit";

// imports 
import categoriesSlice from "./slices/categorySlice";
import subCategorySlice from "./slices/subCategorySlice";
import productSlice from "./slices/productSlice";
import languageSlice from "./slices/languageSlice";
import offerSlice from "./slices/offers";


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
    reducer: {
        categories: categoriesSlice,
        products: productSlice,
        language: languageSlice,
        offer: offerSlice,
    }
})

export default store;