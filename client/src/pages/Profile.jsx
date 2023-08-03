import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

import { AuthContext } from '../context/AuthContext'

import { fetchUser, updateUser } from '../store/UserSlice'

export default function Profile () {
  const [open, setOpen] = React.useState(true)
  const [image, setImage] = React.useState('')
  const pictureRef = React.useRef()

  const { name, email, picture } = useSelector(props => props.user)

  const auth = React.useContext(AuthContext)

  const dispatch = useDispatch()
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

  const changeImage = (event) => {
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

const IconButton = styled(Button)`
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