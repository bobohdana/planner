import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import { AppBar, Avatar, Toolbar, IconButton } from '@mui/material'
import styled from '@emotion/styled'

import { useAppDispatch, useAppSelector } from '../hooks'

import { AuthContext } from '../context/AuthContext'

import UserMenu from './UserMenu'

import logo from '../assets/logo.png'
import unknown from '../assets/unknown.jpg'

import { fetchUser } from '../store/UserSlice'

const Logo = styled.img`
  width: 8rem;
`;

const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
  margin: 0 30px;
`;


const Header: FC<{}> = () => {
  const auth = React.useContext(AuthContext)

  const { picture } = useAppSelector(props => props.user)
  const dispatch = useAppDispatch()
  
  const [anchorEl, setAnchorEl] = React.useState(null)

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => setAnchorEl(null)

  React.useEffect(() => {
    auth.isAuthenticated && dispatch(fetchUser({ auth }))
  }, [dispatch, auth])

  return (
    <AppBar position='sticky' color='inherit'>
      <StyledToolbar>
        <Link to={'/'}>
          <Logo src={logo} alt="logo" />
        </Link>

        {auth.isAuthenticated && (
          <>
            <IconButton onClick={openMenu}>
              <Avatar alt="" src={picture ? picture : unknown} />
            </IconButton>

            <UserMenu anchorEl={anchorEl} close={closeMenu} />
          </>
        )}
      </StyledToolbar>
    </AppBar>
  )
}

export default Header