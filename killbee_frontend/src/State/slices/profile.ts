import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';


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
    error: {message: 'An Error occurred'},
}


export const signInUser = createAsyncThunk(
    "user/signIn",
    async (params: { username: string, password: string }, thunkAPI) => {
        try {
            console.log(params.username);
            console.log("Inside the redux function")
            const requestHeaders: HeadersInit = new Headers();
            requestHeaders.set('Content-Type', 'application/json');
            ;
          
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
            let token = await response.json()
            if (response.status == 200) {
                console.log("INSIDE 200")
                 localStorage.setItem("token", token)
                return data;
            } else {
                return thunkAPI.rejectWithValue("ok")
                
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e)
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
            .addCase(signInUser.fulfilled, (state, {payload}: PayloadAction<any>) => {
                state.currentUser!.username = payload.username;
                state.currentUser!.role = payload.privilege;
                state.currentUser!.id = payload.id;
                state.isLoading = false;
                state.isAuth = true;
            })
            .addCase(signInUser.pending, (state, {payload}: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                (signInUser.rejected), (state, {payload}: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.error = payload.message;
                })
    }
})

export const {setLogOut} = authSlice.actions;

export const authSelector = (state: any) => state.user;

export default authSlice.reducer;