import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import store from './store'

import ContextProvider from './context/ContextProvider'
import { AuthContext } from './context/AuthContext'

import { useAuth } from './hooks/auth.hook'
import Header from './components/Header'
import { useRoutes } from './routes'

function App() {
  const { token, userId, login, logout } = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  return (
    <AuthContext.Provider value={{
      token, userId, login, logout, isAuthenticated
    }}>
      <Provider store={store}>
        <ContextProvider>
          <HashRouter>
            <Header />
            {routes}
          </HashRouter>
        </ContextProvider>
      </Provider>
    </AuthContext.Provider>
  );
}

export default App;
