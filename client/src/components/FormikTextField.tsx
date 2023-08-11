import React from 'react'

import { getIn } from 'formik'

import { TextField } from '@mui/material'

const MUIFormikTextField = (props) => {
  const {
    field,
    form,
    helperText,
    ...other
  } = props

  const { name } = field
  const { touched, errors } = form

  const fieldError = getIn(errors, name)
  const showError = getIn(touched, name) && Boolean(fieldError)

  return (
    <TextField
      {...field}
      {...other}
      id={name}
      fullWidth
      color="success"
      margin="dense"
      error={showError}
      helperText={showError ? fieldError : helperText}
    />
  )
}

export default MUIFormikTextField