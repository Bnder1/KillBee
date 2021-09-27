

import { combineReducers } from '@reduxjs/toolkit'
import  authSlice  from '../slices/profile'

const rootReducer = combineReducers({
     user : authSlice
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer