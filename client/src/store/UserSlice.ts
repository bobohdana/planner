import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { request } from '../hooks/http.hook'
import { IAuth } from '../interfaces'

export const fetchUser = createAsyncThunk(
  'plans/fetchUser', 
  async ({ auth }: { auth: IAuth }, { rejectWithValue, dispatch }) => {
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
  async ({ auth, data }: { auth: IAuth, data: any }, { rejectWithValue, dispatch }) => { //ERROR
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

interface UserState {
  name: string,
  email: string,
  picture: string,
}

interface Payload {
  [key: string]: string
}

const initialState: UserState = {
  name: '',
  email: '',
  picture: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeName (state, action: PayloadAction<Payload>) {
      state.name = action.payload.name
    },
    changeEmail (state, action: PayloadAction<Payload>) {
      state.email = action.payload.email
    },
    changePicture (state, action: PayloadAction<Payload>) {
      state.picture = action.payload.picture
    },
  },
})

export const { changeName, changeEmail, changePicture } = userSlice.actions

export default userSlice.reducer