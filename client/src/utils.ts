import * as Yup from 'yup'
import dayjs, { Dayjs } from 'dayjs'

import { IRange } from './interfaces'

export const authValidationSchema = Yup.object().shape({
  showName: Yup.boolean(),
  name: Yup
    .string()
    .when('showName', {
      is: true,
      then: () => Yup.string()
        .required('Required')
        .min(2, 'Too Short!')
        .max(40, 'Too Long!')
      }),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .required('Required'),
})

export const authInitialValues = {
  showName: false,
  name: '',
  email: '',
  password: '' 
}

export const getRange = (sortedBy: string, pageIndex: number): IRange => {
  let since: Dayjs
  let until: Dayjs

  if ( sortedBy === 'month' ) {
    since = dayjs().add(pageIndex, 'month').startOf('month')
    until = dayjs().add(pageIndex, 'month').endOf('month')
  } else {
    since = dayjs().add(pageIndex, 'week').startOf('week').add(1, 'day')
    until = dayjs().add(pageIndex, 'week').endOf('week').add(1, 'day')
  }

  return [since.valueOf(), until.valueOf()]
}

export const toShortFormat = (range) => {
  const [start, end] = range

  return [
    dayjs(start).format('MMM D'),
    dayjs(end).format('MMM D')
  ]
}
