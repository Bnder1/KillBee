import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    username: '',
    password: '',
}
type TPayload = {
    username: string;
    password: string;
};
const profileSlice = createSlice({
    name: 'profile',
    initialState: initialState,
    reducers: {
        connect: (state, {payload}: PayloadAction<TPayload>) => {
            state.username = payload.username,
                state.password = payload.password;
        },
    },
});

export const profileReducer = profileSlice.reducer;
export const {connect} = profileSlice.actions;