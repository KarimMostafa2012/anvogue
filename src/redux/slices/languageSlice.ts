import { createSlice } from "@reduxjs/toolkit";
import i18n from "../../utils/i18n";
import { localStorageUtil } from "@/utils/localStorage";

// Load initial language from localStorage or default to 'en'
const initialState = localStorageUtil.get("language") || "en";

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        changeLanguage: (_state, action) => {
            const selectedLanguage = action.payload;
            i18n.changeLanguage(selectedLanguage);
            localStorageUtil.set("language", selectedLanguage);
            return selectedLanguage;
        },
    },
});

export const { changeLanguage } = languageSlice.actions;

export default languageSlice.reducer;
