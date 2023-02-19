import {useState, useEffect, useCallback} from 'react'

let logoutTimer

export const useAuth = () => {
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

  return {token, login, logout, userId}
}