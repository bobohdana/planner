import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '.'

import { request } from '../hooks/http.hook'
import { IPlan, IAuth, IRange } from '../interfaces'

export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans', 
  async ({ auth, range }: { auth: IAuth, range: IRange }, { rejectWithValue }) => {
    try {
      const data = await request(`api/plan/?range=${JSON.stringify(range)}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      })
    
      return { plans: data}
    } catch (e) {
      if (e.message === 'The user is not authorized') {
        auth.logout()
      }
      return rejectWithValue(e.message)
    }
  }
)

export const fetchPlan = createAsyncThunk(
  'plans/fetchPlan', 
  async ({ auth, id }: { auth: IAuth, id: string }, { rejectWithValue }) => {
    try {
      const data = await request(`api/plan/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      })
    
      return { plan: data}
    } catch (e) {
      if (e.message === 'The user is not authorized') {
        auth.logout()
      }
      return rejectWithValue(e.message)
    }
  }
)

export const createPlan = createAsyncThunk(
  'plans/createPlan', 
  async ({ auth, plan }: { auth: IAuth, plan: IPlan }, { rejectWithValue, dispatch }) => {
    try {
      const data = await request('api/plan/create', {
        method: 'POST',
        body: plan,
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      })

      dispatch(addPlan({ plan: data }))
    
      return { plan: data}
    } catch (e) {
      console.log('e', e);
      return rejectWithValue(e.message)
    }
  }
)

export const deletePlan = createAsyncThunk(
  'plans/deletePlan', 
  async ({ auth, id }: { auth: IAuth, id: string }, { rejectWithValue, dispatch }) => {
    try {
      const data = await request(`api/plan/delete${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      })

      dispatch(removePlan({ id }))
    
      return { plan: data}
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const updatePlan = createAsyncThunk(
  'plans/updatePlan', 
  async ({ auth, plan }: { auth: IAuth, plan: IPlan }, { rejectWithValue, dispatch }) => {
    try {
      const data = await request(`api/plan`, {
        method: 'PUT',
        body: plan,
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      })

      dispatch(changePlan({ updatedPlan: data }))
    
      return { plan }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

interface PlanState {
  currentPlan: IPlan,
  plans: IPlan[],
  loading: boolean,
}

interface Payload {
  [key: string]: IPlan | IPlan[] | string | null | any
}


const initialState: PlanState = {
  currentPlan: null,
  plans: null,
  loading: false,
}

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    addPlan (state, action: PayloadAction<Payload>) { //ERROR
      state.plans.push(action.payload.plan)
    },
    removePlan (state, action) {
      state.plans = state.plans
        .filter(({ _id }) => _id !== action.payload.id)
    },
    changePlan (state, action: PayloadAction<Payload>) {  //ERROR
      state.plans = state.plans.map((plan) => {
        if (plan._id === action.payload.updatedPlan._id)
          return action.payload.updatedPlan

        return plan
      })
    },
    clearCurrentPlan (state) {
      state.currentPlan = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPlans.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchPlans.fulfilled, (state, action: PayloadAction<Payload>) => {      
      state.plans = action.payload.plans
      state.loading = false
    })
    builder.addCase(fetchPlan.fulfilled, (state, action: PayloadAction<Payload>) => {
      state.currentPlan = action.payload.plan
    })
  },
})

export const { addPlan, removePlan, changePlan, clearCurrentPlan } = planSlice.actions

export default planSlice.reducer