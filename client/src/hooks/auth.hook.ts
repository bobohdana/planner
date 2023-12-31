import React from 'react'

import { IAuth } from '../interfaces'

const storageName = 'userData'

export const useAuth = (): IAuth => {
  const [token, setToken] = React.useState(null)
  const [userId, setUserId] = React.useState(null)

  const login = React.useCallback((jwtToken, id) => {
    setToken(jwtToken)
    setUserId(id)

    localStorage.setItem(storageName, JSON.stringify({
      userId: id,
      token: jwtToken 
    }))
  }, [])

  const logout = React.useCallback(() => {
    setToken(null)
    setUserId(null)

    localStorage.removeItem(storageName)
  }, [])

  React.useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data && data.token) {
      login(data.token, data.userId)
    }
  }, [login])

  return { login, logout, token, userId }
}