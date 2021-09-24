import auth from "../slices/profile";

import { combineReducers } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
    auth
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer