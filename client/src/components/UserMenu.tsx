import React from 'react'

import { useNavigate } from 'react-router-dom'

import { Menu, MenuItem } from '@mui/material'

import { AuthContext } from '../context/AuthContext'

export default function UserMenu({ anchorEl, close }) {
  const { logout } = React.useContext(AuthContext)

  const navigate = useNavigate()
  const open = Boolean(anchorEl)

  const openProfile = () => {
    navigate('/dashboard/profile')
    close()
  }

  const handleLogout = () => {
    logout()
    close()
  }

  return (
    <Menu
      open={open}
      onClose={close}
      anchorEl={anchorEl}
    >
      <MenuItem onClick={openProfile}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Sign out</MenuItem>
    </Menu>
  )
}