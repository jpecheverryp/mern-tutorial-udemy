import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Users from './user/pages/Users'
import NewPlace from './places/pages/NewPlace'
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';

let logoutTimer

const App = () => {
  const [token, setToken] = useState(false)
  const [tokenExpDate, setTokenExpDate] = useState()
  const [userId, setUserId] = useState(null)

  const login = useCallback((userId, token, expirationDate) => {
    setToken(token)
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    setTokenExpDate(tokenExpirationDate)
    localStorage.setItem('userData', JSON.stringify({
      userId,
      token,
      expiration: tokenExpirationDate.toISOString()
    }))
    setUserId(userId)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setTokenExpDate(null)
    setUserId(null)
    localStorage.removeItem('userData')
  }, [])

  useEffect(() => {
    if (token && tokenExpDate) {
      const remainingTime = tokenExpDate.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpDate])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (
      storedData && 
      storedData.token && 
      new Date(storedData.expiration) > new Date() // checks if expiration date is in the future
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
    }
  }, [login])

  let routes;

  if (token) {
    routes = (
      <Switch>
      <Route exact path='/'>
        <Users />
      </Route>
      <Route exact path='/:userId/places'>
        <UserPlaces />
      </Route>
      <Route exact path='/places/new'>
        <NewPlace />
      </Route>
      <Route path='/places/:placeId'>
        <UpdatePlace />
      </Route>
      <Redirect to='/' />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route exact path='/'>
          <Users />
        </Route>
        <Route exact path='/:userId/places'>
          <UserPlaces />
        </Route>
        <Route path='/auth'>
          <Auth />
        </Route>
        <Redirect to='/auth' />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider 
      value={{
        isLoggedIn: !!token, 
        token: token,
        userId: userId, 
        login: login, 
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>  
          {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  )
}

export default App;
