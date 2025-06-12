import { createSlice } from "@reduxjs/toolkit";
import i18n from "../../utils/i18n";

// Load initial language from localStorage or default to 'en'
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en';
  }
  return 'en';
};

const initialState = getInitialLanguage();

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        changeLanguage: (_state, action) => {
            const selectedLanguage = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('language', selectedLanguage);
                document.documentElement.lang = selectedLanguage;
                document.documentElement.dir = selectedLanguage === 'ar' ? 'rtl' : 'ltr';
            }
            i18n.changeLanguage(selectedLanguage);
            return selectedLanguage;
        },
        initializeLanguage: (_state) => {
            const savedLanguage = getInitialLanguage();
            if (typeof window !== 'undefined') {
                document.documentElement.lang = savedLanguage;
                document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
            }
            i18n.changeLanguage(savedLanguage);
            return savedLanguage;
        }
    },
});

export const { changeLanguage, initializeLanguage } = languageSlice.actions;

export default languageSlice.reducer;
