import React from 'react'

import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { Dayjs } from 'dayjs'

import { useFormikContext } from 'formik'

const DatePickerField = () => {
  const { values: { date }, setFieldValue } = useFormikContext<Dayjs | null>()

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          // views={['day', 'month', 'year']}
          value={date}
          onChange={(newValue) => setFieldValue('date', newValue)}
         />
      </DemoContainer>
    </LocalizationProvider>
  )
}

export default DatePickerField