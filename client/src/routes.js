import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Detail from './pages/Detail'
import AuthPage from './pages/Auth'
import Profile from './pages/Profile'

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path='dashboard' exact element={<Dashboard />}>
          <Route path=':planId' element={<Detail />} />
          <Route path='profile' element={<Profile />} />
        </Route>

        <Route path='*' element={<Navigate to={'dashboard'} />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path='auth' element={<AuthPage />} />
      <Route path='*' element={<Navigate to={'auth'} />} />
    </Routes>
  )
}