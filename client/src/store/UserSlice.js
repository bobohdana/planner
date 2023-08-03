import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { request } from '../hooks/http.hook'

export const fetchUser = createAsyncThunk(
  'plans/fetchUser', 
  async ({ auth }, { rejectWithValue, dispatch }) => {
    try {
      const data = await request(`api/user`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      })

      dispatch(changeName({ name: data.name }))
      dispatch(changeEmail({ email: data.email }))
      dispatch(changePicture({ picture: data.picture }))
    
      return { user: data}
    } catch (e) {
      if (e.message === 'The user is not authorized') {
        auth.logout()
      }
      return rejectWithValue(e.message)
    }
  }
)

export const updateUser = createAsyncThunk(
  'plans/updateUser', 
  async ({ auth, data }, { rejectWithValue, dispatch }) => {
    try {
      const user = await request(`api/user`, {
        method: 'PUT',
        body: data,
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
        isFormData: true
      })

      dispatch(changePicture({ picture: user.picture }))
    
      return { user }
    } catch (e) {
      if (e.message === 'The user is not authorized') {
        auth.logout()
      }
      return rejectWithValue(e.message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    email: '',
    picture: '',
  },
  reducers: {
    changeName (state, action) {
      state.name = action.payload.name
    },
    changeEmail (state, action) {
      state.email = action.payload.email
    },
    changePicture (state, action) {
      state.picture = action.payload.picture
    },
  },
})

export const { changeName, changeEmail, changePicture } = userSlice.actions

export default userSlice.reducer