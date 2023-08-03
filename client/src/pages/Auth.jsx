import React from 'react'

import { Formik, Form, Field, useFormikContext } from 'formik'

import { Button, Snackbar } from '@mui/material'
import styled from '@emotion/styled'

import { AuthContext } from '../context/AuthContext'
import { Context } from '../context/Context'

import FormikTextField from '../components/FormikTextField'
import { authInitialValues, authValidationSchema } from '../utils'

const Root = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledForm = styled(Form)`
  max-width: 750px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 80px;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
`;

const StyledButton = styled.div`
  margin-top: 5px;
  cursor: pointer;
  color: #929292;

  &:hover {
    color: #2e7d32;
  }
`;

const Inner = ({ isSignup, setIsSignup }) => {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const { loading, message, clearMessage } = React.useContext(Context)
  const { setFieldValue } = useFormikContext()

  React.useEffect(() => {
    message && setOpenSnackbar(true)
  }, [message])

  React.useEffect(() => {
    setFieldValue('showName', isSignup)
  }, [isSignup, setFieldValue])

  const changeStatus = () => setIsSignup(!isSignup)

  const closeSnackbar = () => {
    setOpenSnackbar(false)
    clearMessage()
  }
  
  return (
    <>
      <StyledForm>
        {isSignup && (
          <Field
            name={'name'}
            component={FormikTextField}
            label={'Name'}
            disabled={loading}
          />
        )}
        <Field
          name={'email'}
          component={FormikTextField}
          label={'Email'}
          disabled={loading}
        />
        <Field
          name={'password'}
          type="password"
          component={FormikTextField}
          label={'Password'}
          disabled={loading}
        />

        <Button
          type="submit"
          fullWidth
          size="large"
          color="success"
          variant="outlined"
          disabled={loading}
        >
          {!isSignup ? 'Sign in' : 'Sign up'}
        </Button>

        <StyledButton
          type="text"
          onClick={changeStatus}
          disabled={loading}
        >
          {!isSignup ? 'Sign up' : 'Already have an account?'}
        </StyledButton>
      </StyledForm>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        message={message}
      />
    </>
  )
}

const Auth = () => {
  const [isSignup, setIsSignup] = React.useState(true)

  const { request } = React.useContext(Context)

  const auth = React.useContext(AuthContext)

  const submitHandler = async ({ email, password, name }, { resetForm }) => {
    try {
      const data = await request(
        `api/auth/${isSignup ? 'register' : 'login'}`,
        {
          method: 'POST',
          body: { email, password, name }
        }
      )

      isSignup && setIsSignup(false)

      if (data && data.token) {
        auth.login(data.token, data.userId)
      }

      resetForm()
    } catch (e) {}
  }

  return (
    <Root>
      <Formik
        initialValues={authInitialValues}
        validationSchema={authValidationSchema}
        onSubmit={submitHandler}
      >
        <Inner isSignup={isSignup} setIsSignup={setIsSignup} />
      </Formik>
    </Root>
  )
}

export default Auth