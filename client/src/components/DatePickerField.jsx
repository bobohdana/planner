import React from 'react'

import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { useFormikContext } from 'formik'

const DatePickerField = () => {
  const { values, setFieldValue } = useFormikContext()

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          name='date'
          value={values.date}
          onChange={(newValue) => setFieldValue('date', newValue)}
         />
      </DemoContainer>
    </LocalizationProvider>
  )
}

export default DatePickerField