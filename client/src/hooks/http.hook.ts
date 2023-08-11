import React from 'react'

export const request = async (url, { method = 'GET', body = null, headers = {}, isFormData = false }) => {
  try {
    if (body && !isFormData) {
      body = JSON.stringify(body)
      headers['content-type'] = 'application/json'
    }

    const response = await fetch(url, { method, body, headers })
    
    const data = await response.json()

    if (!response.ok) {
      throw new Error( data.message || 'Something went wrong' )
    }

    return data
  } catch (e) {
    throw e
  }
}

export const useHttp = () => {
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState(false)

  const _request = React.useCallback(async (url, options) => {
    setLoading(true)
    try {
      const data = await request(url, options)
      data.message && setMessage(data.message)
      setLoading(false)

      return data
    } catch (e) {
      setLoading(false)
      setMessage(e.message)
      throw e
    }
  }, [])

  const clearMessage = () => setMessage(null)

  return { loading, message, request: _request, clearMessage }
}