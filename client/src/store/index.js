import { configureStore } from '@reduxjs/toolkit'

import userReducer from './UserSlice'
import planReducer from './PlanSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    plans: planReducer,
  }
})