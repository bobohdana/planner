import { configureStore } from '@reduxjs/toolkit'

import userReducer from './UserSlice'
import planReducer from './PlanSlice'


const store = configureStore({
  reducer: {
    user: userReducer,
    plans: planReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store