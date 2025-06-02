import { Offer } from "@/types/products";
import { baseUrl } from "@/utils/constants";
import { localStorageUtil } from "@/utils/localStorage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const defaultLanguage = localStorageUtil.get("language") || "en";
const defaultToken = localStorageUtil.get("accessToken") || "";

interface GetOneProductParams {
  id: number | string;
  lang?: string;
}

// Get product by ID
export const getOfferById = createAsyncThunk<Offer, GetOneProductParams>(
  "offer/getById",
  async ({ id, lang }) => {
    try {
      const { data } = await axios.get<Offer>(`${baseUrl}/offer/${id}/`, {
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

interface OfferState {
  id: number | null;
  offer: Offer | null;
  error: string | null;
  loading: boolean;
};

const initialState: OfferState = {
  id: null,
  offer: null,
  loading: false,
  error: null,
};


const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    clearOffer: (state) => {
      state.id = null;
      state.error = null;
      state.offer = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(getOfferById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOfferById.fulfilled, (state, action) => {
        state.loading = false;
        state.offer = action.payload;
        state.error = null;
      })
      .addCase(getOfferById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to get offer";
      });
  },
});


export const { clearOffer } = offerSlice.actions;
export default offerSlice.reducer;