import { ProductType } from "@/type/ProductType";
import { Product } from "@/types/products";
import { baseUrl } from "@/utils/constants";
import { localStorageUtil } from "@/utils/localStorage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const defaultLanguage = localStorageUtil.get("language") || "en";
const defaultToken = localStorageUtil.get("accessToken") || "";

interface GetAllProductsParams {
  params?: {
    product_name?: string;
    min_price?: number;
    max_price?: number;
    category?: string;
    sub_category?: string;
    sub_category_id?: number;
    lang?: string;
    page_size?: number;
    page?: number;
    sort?: string;
    color?: string;
    has_offer?: boolean;
  };
}
interface GetOneProductParams {
  id: string;
  lang?: string;
}
interface AddProductParams {
  token?: string;
  body: ProductType;
}
interface UpdateProductParams {
  id: string;
  token?: string;
  body: ProductType;
}
interface DeleteProductParams {
  token?: string;
  id: string;
}

export interface ProductResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductType[];
}

// Get all products
export const getAllProducts = createAsyncThunk<
  ProductResponse | ProductType[],
  GetAllProductsParams
>("products/getAll", async ({ params }) => {
  try {
    const { data } = await axios.get<ProductResponse | ProductType[]>(
      `${baseUrl}/products/`,
      {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Fetched Products:", data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
});

// Get all products
export const getNewArrivals = createAsyncThunk<
  ProductResponse | ProductType[],
  GetAllProductsParams
>("products/getNewArrivals", async ({ params }) => {
  try {
    const { data } = await axios.get<ProductResponse | ProductType[]>(
      `${baseUrl}/home/new-arrivals/`,
      {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Fetched Products:", data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
});

export const getBestSellers = createAsyncThunk<
  ProductResponse | ProductType[],
  GetAllProductsParams
>("products/getBestSellers", async ({ params }) => {
  try {
    const { data } = await axios.get<ProductResponse | ProductType[]>(
      `${baseUrl}/home/new-arrivals/`,
      {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Fetched Products:", data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
});

// Get product by ID
export const getProductById = createAsyncThunk<ProductType, GetOneProductParams>(
  "products/getById",
  async ({ id, lang }) => {
    try {
      const { data } = await axios.get<ProductType>(`${baseUrl}/products/${id}`, {
        params: {
          lang: lang || defaultLanguage,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return data;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  }
);

// Create product
export const createProduct = createAsyncThunk<ProductType, AddProductParams>(
  "products/create",
  async ({ token, body }) => {
    try {
      const formData = new FormData();

      // Append all fields to formData
      for (const key in body) {
        const value = (body as Record<string, any>)[key];
        if (Array.isArray(value)) {
          value.forEach((item: any) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, value);
        }
      }

      const { data } = await axios.post<ProductType>(
        `${baseUrl}/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token || defaultToken}`,
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk<ProductType, UpdateProductParams>(
  "products/update",
  async ({ id, token, body }) => {
    try {
      const formData = new FormData();

      // Append all fields to formData
      for (const key in body) {
        const typedKey = key as keyof ProductType;
        if (Array.isArray(body[typedKey])) {
          (body[typedKey] as any[]).forEach((item: any) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, body[typedKey] as any);
        }
      }

      const { data } = await axios.put<ProductType>(
        `${baseUrl}/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token || defaultToken}`,
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk<null, DeleteProductParams>(
  "products/delete",
  async ({ id, token }) => {
    try {
      const { data } = await axios.delete<null>(`${baseUrl}/products/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || defaultToken}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
);

interface ProductState {
  products: ProductType[];
  product: ProductType | null;
  count: number | null;
  next: string | null;
  prev: string | null;
  loading: boolean;
  error: string | null;
  statusCode: number | null;
}


const initialState: ProductState = {
  products: [],
  product: null,
  count: null,
  next: null,
  prev: null,
  loading: false,
  error: null,
  statusCode: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = null;
      state.error = null;
    },
    clearProducts: (state) => {
      state.products = [];
      state.count = null;
      state.next = null;
      state.prev = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle getAllProducts
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        if ("results" in action.payload) {
          state.products = action.payload.results;
          state.count = action.payload.count;
          state.next = action.payload.next;
          state.prev = action.payload.previous;
        } else {
          state.products = action.payload;
          state.count = null;
          state.next = null;
          state.prev = null;
        }
        state.error = null;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
        state.products = [];
      })

      .addCase(getNewArrivals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        if ("results" in action.payload) {
          state.products = action.payload.results;
          state.count = action.payload.count;
          state.next = action.payload.next;
          state.prev = action.payload.previous;
        } else {
          state.products = action.payload;
          state.count = null;
          state.next = null;
          state.prev = null;
        }
        state.error = null;
      })
      .addCase(getBestSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
        state.products = [];
      })

      .addCase(getBestSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBestSellers.fulfilled, (state, action) => {
        state.loading = false;
        if ("results" in action.payload) {
          state.products = action.payload.results;
          state.count = action.payload.count;
          state.next = action.payload.next;
          state.prev = action.payload.previous;
        } else {
          state.products = action.payload;
          state.count = null;
          state.next = null;
          state.prev = null;
        }
        state.error = null;
      })
      .addCase(getNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
        state.products = [];
      })

      // Handle getProductById
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
        state.product = null;
      })

      // Handle createProduct
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload); // Add new product at beginning
        state.product = action.payload;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      })

      // Handle updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        state.products = state.products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
        state.product = updatedProduct;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      })

      // Handle deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;

        // Get the ID from the thunk argument (meta.arg)
        const deletedProductId = action.meta.arg.id;

        state.products = state.products.filter(
          (product) => product.id !== deletedProductId
        );
        if (state.product?.id === deletedProductId) {
          state.product = null;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete product";
      })
  },
});

export const { clearProduct, clearProducts } = productSlice.actions;
export default productSlice.reducer;
