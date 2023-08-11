import React, { EffectCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { Formik, Form, Field } from 'formik'

import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button 
} from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'

import { useAppDispatch, useAppSelector } from '../hooks'

import { AuthContext } from '../context/AuthContext'

import FormikTextField from '../components/FormikTextField'
import DatePickerField from '../components/DatePickerField'
import {
  fetchPlan,
  createPlan,
  updatePlan,
  deletePlan,
  clearCurrentPlan } from '../store/PlanSlice'

interface FormikValues {
  text: string,
  date: Dayjs,
  _id?: string,
}

export default function Detail () {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { planId } = useParams()
  const isCreateMode = planId === 'create'

  const auth = React.useContext(AuthContext)

  const [open, setOpen] = React.useState(true)
  const [initialLoading, setInitialLoading] = React.useState(false)

  const { currentPlan } = useAppSelector(state => state.plans)
  const { _id, text, date } = currentPlan || {}

  const initialValues: FormikValues = {
    text: (text || ''),
    date: date ? dayjs(date) : dayjs(),
  }
  if (_id) {
    initialValues._id = _id
  }

  React.useEffect((): ReturnType<EffectCallback> => {
    return (): void => {
      dispatch(clearCurrentPlan())
    }
  }, [])

  React.useEffect(() => {
    !isCreateMode && setInitialLoading(!currentPlan)
  }, [currentPlan])

  React.useEffect(() => {
    if (!isCreateMode) {
      setInitialLoading(true)
      dispatch(fetchPlan({ auth, id: planId }))
    }
  }, [planId])

  const handleClose = () => {
    setOpen(false)
    navigate('../')
  }

  const handleDelete = () => {
    dispatch(deletePlan({ auth, id: _id }))
    handleClose()
  }

  const onSubmit = (plan: FormikValues) => {
    if (!plan.text) {
      return handleClose()
    }

    // console.log('subtract', (plan.date - Date.now()) / 86400000);


    if (isCreateMode) {
      dispatch(createPlan({ auth, plan }))
    } else {
      dispatch(updatePlan({ auth, plan }))
    }

    handleClose()
  }

  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      {!initialLoading && <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <DialogTitle>
              {isCreateMode ? 'Create a new plan' : 'Updating'}
            </DialogTitle>
            <DialogContent>
              <DatePickerField />
              <Field
                name={'text'}
                component={FormikTextField}
                placeholder={'Type something...'}
                multiline
                minRows={6}
                maxRows={10}
              />
            </DialogContent>
            <DialogActions>
              {!!_id && (
                <Button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  color='warning'
                >
                  Delete
                </Button>
              )}

              <Button
                type='submit'
                disabled={isSubmitting}
                color='success'
              >
                {isCreateMode ? 'Create' : 'Save'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>}
    </Dialog>
  )
}