import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UserState {

}

const initialState: UserState = {
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userLogin: (state: any, action: PayloadAction<UserState>) => ({
            ...state,
            ...action.payload,
        }),
        userLogout: (_state: any) => ({
        }),
    },
});

export const {
    userLogin,
    userLogout,
} = userSlice.actions;

export default userSlice.reducer;