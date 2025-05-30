import { baseUrl } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface ForgetPasswordRequest {
    body: {
        email: string;
    }
}
interface ForgetPasswordResponse {
    message: string;
}
interface ResetPasswordRequest {
    body: {
        email: string;
        otp: number,
        newPassword: string
        rePassword: string
    }
}
interface ResetPasswordResponse {
    message: string;
}

export const forgetPassword = createAsyncThunk<ForgetPasswordResponse, ForgetPasswordRequest>("auth/forgetPassword", async ({ body }) => {
    try {
        const { data } = await axios.post<ForgetPasswordResponse>(`${baseUrl}/auth/forgetPassword`, body, {
            headers: {
                "Accept": "application/json"
            }
        })
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
})
export const resetPassword = createAsyncThunk<ResetPasswordResponse, ResetPasswordRequest>("auth/resetPassword", async ({ body }) => {
    try {
        const { data } = await axios.post<ResetPasswordResponse>(`${baseUrl}/auth/resetPassword`, body, {
            headers: {
                "Accept": "application/json"
            }
        })
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
})

interface InitialState {
    user: null;
    accessToken: string | null;
    refreshToken: string | null;
    status: string | null;
    loading: boolean;
    error: string | null;
    message: string;
}

const initialState: InitialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    status: null,
    loading: false,
    error: null,
    message: ""
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(forgetPassword.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(forgetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })
            // ------------------------------------------------------------------------------
            .addCase(resetPassword.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })
    }
})


export default authSlice.reducer