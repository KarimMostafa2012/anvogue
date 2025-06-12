import { Category, Icon } from "@/types/categories";
import { baseUrl } from "@/utils/constants";
import { localStorageUtil } from "@/utils/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// Get language (string)
const defaultLanguage = localStorageUtil.get('language') || 'en';
const defaultToken = localStorageUtil.get('accessToken') || '';
interface GetAllCategoriesParams {
    lang?: string;
    token?: string;
}
interface GetOneCategoryParams {
    lang?: string;
    token?: string;
    id: string;
}
interface DeleteCategoryParams {
    token?: string;
    id: string;
}

interface UpdateCategoryParams {
    token?: string;
    id: string;
    body: {
        id: number;
        name?: string;
        icon: Icon;
        translation: {
            en?: { name: string };
            ckb?: { name: string };
            de?: { name: string };
            uk?: { name: string };
            ar?: { name: string };
        }
    };
}
interface CreateCategoryParams {
    token?: string;
    body: {
        id: number;
        name?: string;
        icon: Icon;
        translation: {
            en: { name: string };
            ckb: { name: string };
            de: { name: string };
            uk: { name: string };
            ar: { name: string };
        }
    };
}

interface CreateIconParams {
    token?: string;
    body: {
        icon: File;
    };
}

export const getAllCategories = createAsyncThunk<Category[], GetAllCategoriesParams>(
    "categories/get",
    async ({ lang, token }) => {
        try {
            const { data } = await axios.get<Category[]>(`${baseUrl}/products/category`, {
                params: {
                    lang: lang || defaultLanguage
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    }
)

export const getCategoryById = createAsyncThunk<Category, GetOneCategoryParams>(
    "categories/getById",
    async ({ id, lang }) => {
        try {
            const { data } = await axios.get<Category>(`${baseUrl}/products/category/${id}`, {
                params: {
                    lang: lang || defaultLanguage
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return data;
        } catch (error) {
            console.error("Error fetching category by ID:", error);
            throw error;
        }
    }
)

export const updateCategory = createAsyncThunk<Category, UpdateCategoryParams>(
    "categories/update",
    async ({ id, token, body }) => {
        try {
            const { data } = await axios.put<Category>(`${baseUrl}/products/category/${id}`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || defaultToken}`
                },
            });
            return data;
        } catch (error) {
            console.error("Error updating category:", error);
            throw error;
        }
    }
)

export const deleteCategory = createAsyncThunk<null, DeleteCategoryParams>(
    "categories/delete",
    async ({ id, token }) => {
        try {
            const { data } = await axios.delete<null>(`${baseUrl}/products/category/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || defaultToken}`
                }
            });
            return data;
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    }
)

export const createCategory = createAsyncThunk<Category, CreateCategoryParams>(
    "categories/create",
    async ({ token, body }) => {
        try {
            const { data } = await axios.post<Category>(`${baseUrl}/products/category`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || defaultToken}`
                }
            });
            return data;
        } catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    }
)

export const getIcons = createAsyncThunk(
    "categories/getIcons",
    async () => {
        try {
            const { data } = await axios.get<Icon[]>(`${baseUrl}/products/icon`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return data;
        } catch (error) {
            console.error("Error fetching icons:", error);
            throw error;
        }
    }
)

export const createIcon = createAsyncThunk<Icon, CreateIconParams>(
    "categories/createIcon",
    async ({ token, body }) => {
        try {
            // Create a new FormData instance
            const formData = new FormData();
            for (const key in body) {
                const typedKey = key as keyof typeof body;
                if (Array.isArray(body[typedKey])) {
                    (body[typedKey] as unknown as (string | Blob)[]).forEach((item: string | Blob) => {
                        formData.append(key, item);
                    });
                } else {
                    formData.append(key, body[typedKey]);
                }
            }

            const { data } = await axios.post(`${baseUrl}/products/icon`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token || defaultToken}`
                }
            });
            return data;
        } catch (error) {
            console.error("Error creating icon:", error);
            throw error;
        }
    }
);
interface InitialState {
    categories: Category[];
    category: Category | null;
    icons: Icon[];
    loading: boolean;
    error: string | undefined;
    statusCode: number | null;
}

const initialState: InitialState = {
    categories: [],
    category: null,
    icons: [],
    loading: false,
    error: undefined,
    statusCode: null
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle getAllCategories
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(getAllCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.loading = false;
                state.categories = action.payload;
                state.error = undefined;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle getCategoryById
            .addCase(getCategoryById.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(getCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.category = action.payload;
                state.error = undefined;
            })
            .addCase(getCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle updateCategory
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const updatedCategory = action.payload;
                state.categories = state.categories.map(category =>
                    category.id === updatedCategory.id ? updatedCategory : category
                );
                state.category = updatedCategory;
                state.error = undefined;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle deleteCategory
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;

                // Get the ID from the thunk argument (meta.arg)
                const deletedCategoryId = action.meta.arg.id;

                state.categories = state.categories.filter(category => category.id !== Number(deletedCategoryId));

                // Clear selected category if it was the one deleted
                if (state.category?.id === Number(deletedCategoryId)) {
                    state.category = null;
                }

                state.error = undefined;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle createCategory
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                const newCategory = action.payload;
                state.categories.push(newCategory);
                state.category = newCategory; // Set the newly created category as the current category
                state.error = undefined;
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle getIcons
            .addCase(getIcons.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(getIcons.fulfilled, (state, action) => {
                state.loading = false;
                state.icons = action.payload;
                state.error = undefined;
            })
            .addCase(getIcons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle createIcon
            .addCase(createIcon.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(createIcon.fulfilled, (state, action) => {
                state.loading = false;
                const newIcon = action.payload;
                state.icons.push(newIcon);
                state.error = undefined;
            })
            .addCase(createIcon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default categorySlice.reducer;