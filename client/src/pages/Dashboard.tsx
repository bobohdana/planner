import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import styled from '@emotion/styled'

import { Context } from '../context/Context'

import { IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'

import GridContainer from '../components/GridContainer'
import Toolbar from '../components/Toolbar'

interface AddButtonProps {
  variant: string,
}
const AddButton = styled(IconButton)<AddButtonProps>`
  position: fixed !important;
  font-size: 60px;
  right: 30px;
  bottom: 30px;
  width: 80px;
  height: 80px;
`;

const Root = styled.div`
  padding: 40px 60px;
`;

export default function Dashboard () {
  const { loadPlans, range } = React.useContext(Context)

  const navigate = useNavigate()

  const createPlan = () => {
    navigate('create')
  }

  React.useEffect(() => {
    loadPlans()
  }, [range, loadPlans])

  return ( 
    <Root>
      <AddButton onClick={createPlan} variant='contained'>
        <Add fontSize={'large'} color='success' />
      </AddButton>

      <Toolbar />
      <GridContainer />

      <Outlet />
    </Root>
  )
}