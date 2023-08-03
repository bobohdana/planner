import React from 'react'
import { useDispatch } from 'react-redux'

import { Context } from './Context'
import { AuthContext } from './AuthContext'

import { useHttp } from '../hooks/http.hook'
import { fetchPlans } from '../store/PlanSlice'
import { getRange } from '../utils'


const ContextProvider = ({ children }) => {
  const [sortedBy, setSortedBy] = React.useState('week')
  const [pageIndex, setPageIndex] = React.useState(0)
  const [range, setRange] = React.useState(null)

  const auth = React.useContext(AuthContext)

  const dispatch = useDispatch()
  const http = useHttp()

  const changeSortedBy = ({ target: { value } }) => {
    setSortedBy(value)
    setPageIndex(0)
  }

  const nextPage = () => {
    setPageIndex(prev => prev + 1)
  }

  const previousPage = () => {
    setPageIndex(prev => prev - 1)
  }

  const loadPlans = React.useCallback(() => {
    dispatch(fetchPlans({ auth, range }))
  }, [auth, range, dispatch])

  React.useEffect(() => {
    setRange([...getRange(sortedBy, pageIndex)])
  }, [pageIndex, sortedBy])

  const context = {
    ...http,

    loadPlans,

    sortedBy,
    changeSortedBy,

    pageIndex,
    nextPage,
    previousPage,
    setPageIndex,

    range,
  }

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  )
}

export default ContextProvider