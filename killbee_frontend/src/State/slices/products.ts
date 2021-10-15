import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface ProductError {
    message: string
}

export interface ProductState {
    currentProduct?: Product
    isLoading: boolean
    error: ProductError
    allProducts?: Product[]
}

export interface Product {
    id: string
    name: string
    description: string
    ingredient: number
}

export const initialState: ProductState = {
    isLoading: false,
    error: { message: 'An Error occurred with this product' },
}

export const createProduct = createAsyncThunk(
    "product/create",
    async (params: { name: string, description: string, ingredient: number}, thunkAPI) => {
        try {
            //console.log(params.username);
            console.log("Inside the redux function")
            const requestHeaders: HeadersInit = new Headers();
            requestHeaders.set('Content-Type', 'application/json',);
            requestHeaders.set('Access-Control-Allow-Origin', '*');
            const response = await fetch(
                "http://backend:3000/products/create",
                {
                    method: "POST",
                    headers: requestHeaders,
                    body: JSON.stringify(
                        params
                    ),
                }
            )
            let data = await response
            let rep = await response.json()
            let token = rep.token
            let product = response.body
            if (response.status == 200) {
                console.log("INSIDE 200")
                localStorage.setItem("token", token)
                return product;
            } else {
                return thunkAPI.rejectWithValue("ok")

            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getProducts = createAsyncThunk(
    "product/get",
    async({},thunkAPI) => {
        try {
            console.log("Inside the redux function")
            const requestHeaders: HeadersInit = new Headers();
            requestHeaders.set('Content-Type', 'application/json',);
            requestHeaders.set('Access-Control-Allow-Origin', '*');
            const response = await fetch(
                "http//bakckend:3000/products",
                {
                    method: "GET",
                    headers: requestHeaders,
                }
            )
            let data = await response
            let rep = await response.json()
            let token = rep.token
            let products = response.body
            if (response.status == 200) {
                console.log("INSIDE 200")
                return products;
            } else {
                return thunkAPI.rejectWithValue("ok")
            }
        } catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
}
)

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        },
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.fulfilled, (state, { payload }: PayloadAction<any>) => {
                console.log(payload)
                state.currentProduct = {} as Product
                state.currentProduct!.name = payload.name;
                state.currentProduct!.description = payload.description;
                state.currentProduct!.ingredient = payload.ingredient;
                state.isLoading = false;
            })
            .addCase(createProduct.pending, (state, { payload }: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                (createProduct.rejected), (state, { payload }: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.error = payload.message;
                })
            .addCase((getProducts.fulfilled), (state, {payload}: PayloadAction<any>) => {
                state.allProducts = payload.body
                state.isLoading = false
            })
            .addCase(
                (getProducts.rejected), (state, { payload }: PayloadAction<any>) => {
                    state.isLoading = false;
                    state.error = payload.message;
                })
    }
})

export const {} = productSlice.actions;

export const productSelector = (state: any) => state;

export default productSlice.reducer;