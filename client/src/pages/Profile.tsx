import React from 'react'
import { useNavigate } from 'react-router-dom'

import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button, 
  Avatar,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

import styled from '@emotion/styled'

import { useAppDispatch, useAppSelector } from '../hooks'

import { AuthContext } from '../context/AuthContext'

import { fetchUser, updateUser } from '../store/UserSlice'

export default function Profile () {
  const [open, setOpen] = React.useState<boolean>(true)
  const [image, setImage] = React.useState<Blob>()
  const pictureRef = React.useRef()

  const { name, email, picture } = useAppSelector(props => props.user)

  const auth = React.useContext(AuthContext)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  React.useEffect(() => {
    dispatch(fetchUser({ auth }))
  }, [dispatch, auth])

  const handleClose = () => {
    setOpen(false)
    navigate('../')
  }

  const save = React.useCallback(() => {
    if (image) {
      dispatch(updateUser({ auth, data: new FormData(pictureRef.current)}))
    }

    handleClose()
  }, [image])

  const changeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.files[0])
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        {'Profile'}
      </DialogTitle>
      <Content>
        <PicContainer>
          <Picture
            alt="Avatar"
            src={image ? URL.createObjectURL(image) : picture}
          />
          <IconButton component="label" >
            <EditIcon /> edit
            <form ref={pictureRef}>
              <input
                accept="image/*"
                hidden
                type="file"
                name='picture'
                onChange={changeImage} 
              />
            </form>
          </IconButton>
        </PicContainer>

        <Typography>{name && name}</Typography>
        <Typography>{email && email}</Typography>

      </Content>
      <DialogActions>
        <Button color='success' onClick={save}>
          {'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const Content = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

const PicContainer = styled.div`
  position: relative;
`;

const Picture = styled(Avatar)`
  width: 200px;
  height: 200px;
  margin: 20px 0 30px;
`;

interface IconButtonProps {
  component: React.ReactNode
}
const IconButton = styled(Button)<IconButtonProps>`
  text-transform: none;
  position: absolute;
  font-size: 16px;
  color: #8f8c8c;
  bottom: 20px;
  right: -30px;
  
  &:hover {
    background-color: transparent;
  }
`;