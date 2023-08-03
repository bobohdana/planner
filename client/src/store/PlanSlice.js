import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { request } from '../hooks/http.hook'

export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans', 
  async ({ auth, range }, { rejectWithValue }) => {
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
  async ({ auth, id }, { rejectWithValue }) => {
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
  async ({ auth, plan }, { rejectWithValue, dispatch }) => {
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
  async ({ auth, id }, { rejectWithValue, dispatch }) => {
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
  async ({ auth, plan }, { rejectWithValue, dispatch }) => {
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


const planSlice = createSlice({
  name: 'plans',
  initialState: {
    currentPlan: null,
    plans: null,
    loading: false,
  },
  reducers: {
    addPlan (state, action) {
      state.plans.push(action.payload.plan)
    },
    removePlan (state, action) {
      state.plans = state.plans
        .filter(({ _id }) => _id !== action.payload.id)
    },
    changePlan (state, action) {
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
  extraReducers: {
    [fetchPlans.pending]: (state) => {
      state.loading = true
    },
    [fetchPlans.fulfilled]: (state, action) => {
      state.plans = action.payload.plans
      state.loading = false
    },
    [fetchPlan.fulfilled]: (state, action) => {
      state.currentPlan = action.payload.plan
    },
    // [createPlan.fulfilled]: (state, action) => {
    //   console.log('fulfilled createPlan action.payload', action.payload);
    //   // state.newPlan = action.payload.plan
    // },
    // [createPlan.rejected]: (action) => {
    //   console.log('rejected', action.payload);
    // },
  }
})

export const { addPlan, removePlan, changePlan, clearCurrentPlan } = planSlice.actions

export default planSlice.reducer