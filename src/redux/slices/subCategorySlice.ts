import { baseUrl } from "@/utils/constants";
import { localStorageUtil } from "@/utils/localStorage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const defaultLanguage = localStorageUtil.get('language') || 'en';
const defaultToken = localStorageUtil.get('accessToken') || '';

interface SubCategoryParams {
    lang?: string;
    token?: string;
    id?: string;
    body?: any;
}

// Get all subcategories
export const getAllSubCategories = createAsyncThunk(
    "subCategories/get",
    async ({ lang, token }: SubCategoryParams) => {
        try {
            const { data } = await axios.get(`${baseUrl}/products/subcategory`, {
                params: {
                    lang: lang || defaultLanguage
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || defaultToken}`
                }
            });
            return data;
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            throw error;
        }
    }
)

// Get subcategory by ID
export const getSubCategoryById = createAsyncThunk(
    "subCategories/getById",
    async ({ id, lang, token }: SubCategoryParams) => {
        try {
            const { data } = await axios.get(`${baseUrl}/products/subcategory/${id}`, {
                params: {
                    lang: lang || defaultLanguage
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || defaultToken}`
                }
            });
            return data;
        } catch (error) {
            console.error("Error fetching subcategory by ID:", error);
            throw error;
        }
    }
)

// Update subcategory
export const updateSubCategory = createAsyncThunk(
    "subCategories/update",
    async ({ id, lang, token, body }: SubCategoryParams) => {
        try {
            const { data } = await axios.put(`${baseUrl}/products/subcategory/${id}`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || defaultToken}`
                },
                params: {
                    lang: lang || defaultLanguage
                }
            });
            return data;
        } catch (error) {
            console.error("Error updating subcategory:", error);
            throw error;
        }
    }
)

// Delete subcategory
export const deleteSubCategory = createAsyncThunk(
    "subCategories/delete",
    async ({ id, token }: SubCategoryParams) => {
        try {
            const { data } = await axios.delete(`${baseUrl}/products/subcategory/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || defaultToken}`
                }
            });
            return data;
        } catch (error) {
            console.error("Error deleting subcategory:", error);
            throw error;
        }
    }
)

// Create subcategory
export const createSubCategory = createAsyncThunk(
    "subCategories/create",
    async ({ token, body }: SubCategoryParams) => {
        try {
            const { data } = await axios.post(`${baseUrl}/products/subcategory`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || defaultToken}`
                }
            });
            return data;
        } catch (error) {
            console.error("Error creating subcategory:", error);
            throw error;
        }
    }
)

interface SubCategoryState {
    subCategories: any[];
    subCategory: any | null;
    loading: boolean;
    error: string | null;
    statusCode: number | null;
}

const initialState: SubCategoryState = {
    subCategories: [],
    subCategory: null,
    loading: false,
    error: null,
    statusCode: null
}

const subCategorySlice = createSlice({
    name: 'subCategory',
    initialState,
    reducers: {
        // ... existing code ...
    },
    extraReducers: (builder) => {
        builder
            // Handle getAllSubCategories
            .addCase(getAllSubCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSubCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.subCategories = action.payload;
                state.error = null;
            })
            .addCase(getAllSubCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            })
            // Handle getSubCategoryById
            .addCase(getSubCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSubCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.subCategory = action.payload;
                state.error = null;
            })
            .addCase(getSubCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            })
            // Handle updateSubCategory
            .addCase(updateSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSubCategory.fulfilled, (state, action) => {
                state.loading = false;
                const updatedSubCategory = action.payload;
                state.subCategories = state.subCategories.map(subCategory =>
                    subCategory.id === updatedSubCategory.id ? updatedSubCategory : subCategory
                );
                state.subCategory = updatedSubCategory;
                state.error = null;
            })
            .addCase(updateSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            })
            // Handle deleteSubCategory
            .addCase(deleteSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSubCategory.fulfilled, (state, action) => {
                state.loading = false;
                const deletedSubCategoryId = action.payload.id;
                state.subCategories = state.subCategories.filter(subCategory => subCategory.id !== deletedSubCategoryId);
                state.subCategory = null;
                state.error = null;
            })
            .addCase(deleteSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            })
            // Handle createSubCategory
            .addCase(createSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubCategory.fulfilled, (state, action) => {
                state.loading = false;
                const newSubCategory = action.payload;
                state.subCategories.push(newSubCategory);
                state.subCategory = newSubCategory;
                state.error = null;
            })
            .addCase(createSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            })
    }
});

export default subCategorySlice.reducer;