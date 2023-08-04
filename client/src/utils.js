import * as Yup from 'yup'
import dayjs from 'dayjs'

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

export const getRange = (sortedBy, pageIndex) => {
  let since
  let until

  if ( sortedBy === 'month' ) {
    since = new Date(dayjs().add(pageIndex, 'month').startOf('month'))
    until = new Date(dayjs().add(pageIndex, 'month').endOf('month'))
  } else {
    since = new Date(dayjs().add(pageIndex, 'week').startOf('week').add(1, 'day'))
    until = new Date(dayjs().add(pageIndex, 'week').endOf('week').add(1, 'day'))
  }

  return [since.getTime(), until.getTime()]
}

export const toShortFormat = (range) => {
  const [start, end] = range

  return [
    dayjs(start).format('MMM D'),
    dayjs(end).format('MMM D')
  ]
}
