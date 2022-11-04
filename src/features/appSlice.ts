import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { User, ThemeState } from '../interfaces/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme } from "../config/theme/Theme";

interface appSlice {
    status: boolean;
    versionApp: string;
    theme: ThemeState;
    isShowWellcome: boolean;
    User?: User;
};

const initialState: appSlice = {
    status: false,
    versionApp: '1.0',
    theme: lightTheme,
    isShowWellcome: true,
    User: undefined,
};

export const test = createAsyncThunk('LogIn', async (User: User) => {
    try {
        await AsyncStorage.setItem('token', User.token);
        return User;
    } catch (error) { console.log('Error') }
});

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        LogOut: (state) => {
            state.User = undefined;
            state.status = false;
        },
        updateTheme: (state, action: PayloadAction<ThemeState>) => {
            state.theme = action.payload;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.User = action.payload;
            state.status = true;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(test.fulfilled, (state, { payload }) => {
            state.User = payload;
        })
    }
});

export const {
    updateTheme,
    LogOut, setUser } = appSlice.actions;
export const app = (state: RootState) => state.app;
export default appSlice.reducer;