import {combineReducers} from '@reduxjs/toolkit'
import authSlice from '../slices/profile'
import productSlice from '../slices/products'

const rootReducer = combineReducers({
    user: authSlice,
    products: productSlice,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer