import * as Yup from 'yup'

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

  const date = new Date()
  if ( sortedBy === 'month' ) {
    since = new Date(
      date.getFullYear(),
      date.getMonth() + pageIndex,
      1
    )

    until = new Date(
      date.getFullYear(),
      date.getMonth() + 1  + pageIndex,
      1
    )
  } else {
    since = new Date(
      date.setDate(date.getDate() - date.getDay() + 1 + 7 * pageIndex)
    )
    since.setHours(0, 0, 0)

    until = new Date(
      date.setDate(date.getDate() - date.getDay() + 8)
    )
    until.setHours(0, 0, 0)
  }

  return [since.getTime(), until.getTime()]
}

const options = {  month: 'short', day: 'numeric' }
export const toShortFormat = (range) => {
  const [start, end] = range

  const _end = new Date(end)
  return [
    new Date(start).toLocaleDateString('en-us', options),
    new Date(_end.setDate(_end.getDate() - 1)).toLocaleDateString('en-us', options)
  ]
}
