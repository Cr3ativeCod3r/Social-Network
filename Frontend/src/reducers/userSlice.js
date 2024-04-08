import {createSlice} from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => action.payload,
        logout: (state) => {
            console.log("logout")
            Cookies.remove('user');
            return null;
        },
    },
});

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;
