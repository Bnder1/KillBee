import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { wait } from '@testing-library/dom';


export interface AuthError {
    message: string
}

export interface AuthState {
    isAuth: boolean
    currentUser?: CurrentUser
    isLoading: boolean
    error: AuthError
}

export interface CurrentUser {
    id: string
    username: string
    role: string
}

export const initialState: AuthState = {
    isAuth: false,
    isLoading: false,
    error: { message: 'An Error occurred' },
}


export const signInUser = createAsyncThunk(
    "user/signIn",
    
    async (params: { username: string, password: string }, thunkAPI) => {
        console.log("SIGN IN CALLED");
        try {
            console.log("Inside the redux function")
            const requestHeaders: HeadersInit = new Headers();
            requestHeaders.set('Content-Type', 'application/json');
            const response = await fetch(
                "http://localhost:3000/auth",
                {
                    method: "POST",
                    headers: requestHeaders,
                    body: JSON.stringify(
                        params
                    ),
                }
            )
            let data = await response
            console.log(response);
            let rep = await response.json()
            let token = rep.token
            let user = rep.user
            //WORKING, to be checked by sese
            if (response.status == 200) {
                console.log("INSIDE 200")
                localStorage.setItem("token", token)
                //return user;
            } else {
                //return thunkAPI.rejectWithValue("ok")

            }
        } catch (e) {
            console.log("Error try catch:\n" + e);
            //return thunkAPI.rejectWithValue(e)
        }
    }
)
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogOut: (state) => {
            state.isAuth = false
            state.currentUser = undefined
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInUser.fulfilled, (state, { payload }: PayloadAction<any>) => {
                console.log(payload)
                state.currentUser = {} as CurrentUser
                state.currentUser!.username = payload.sAMAccountName;
                state.currentUser!.role = payload.cn;
                state.currentUser!.id = payload.userAccountControl;
                state.isLoading = false;
                state.isAuth = true;
                console.log(state.currentUser?.role);
                console.log(state.isAuth);
                console.log(state.currentUser?.id);
                

            })
            .addCase(signInUser.pending, (state, { payload }: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                (signInUser.rejected), (state, { payload }: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.error = payload.message;
                })
    }
})

export const { setLogOut } = authSlice.actions;

export const authSelector = (state: any) => state;

export default authSlice.reducer;