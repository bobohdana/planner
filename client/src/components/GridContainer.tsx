import React from 'react'
import { useSelector } from 'react-redux'

import styled from '@emotion/styled'

import { Grid } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'

import { Context } from '../context/Context'
import GridItem from './GridItem'

import { IPlan } from '../interfaces'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const Container = styled.div`
  margin: 40px;
  background-color: #fff;
  // border-radius: 15px;
  overflow: hidden;
  box-shadow: 10px 10px 40px 5px rgba(0,0,0,0.2);
`;

const Item = styled(Grid)`
  border-bottom: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  text-transform: uppercase;
  padding: 10px 5px;
  color: '#767676';
  overflow: hidden;
  &:nth-of-type(7n) {
    border-right: none;
  }
`;

const getWeeksInMonth = (firstDay: Dayjs) => {
  return Math.ceil((dayjs(firstDay).daysInMonth() + dayjs(firstDay).day()) / 7)
}

const getDate = (weekIndex: number, dayIndex: number, firstDay: Dayjs) => {
  let _firstDay = firstDay
  if (dayjs(firstDay).day() != 1) {
    _firstDay = dayjs(firstDay).subtract(dayjs(firstDay).day() - 1, 'day'
    )
  }
  return (dayjs(_firstDay).add(7 * weekIndex + dayIndex, 'day'))
}

const GridContainer = () => {
  const [plansByDate, setPlansByDate] = React.useState(null)
  const { range, sortedBy } = React.useContext(Context)
  const { plans } = useSelector<any, any>(state => state.plans) //ERROR
  
  const numberOfWeeks = sortedBy === 'week' ? 1 : getWeeksInMonth(range[0])

  React.useEffect(() => {
    if (!!plans) {
      const _plans = {}
      plans.forEach((plan) => {
        const date = dayjs(plan.date).date()
        _plans[date] = [...(_plans[date] || []), plan]
      })
      setPlansByDate({..._plans})
    }
  }, [plans])

  return (
    <Container>
      <Grid container columns={{ xs: 7 }}>
        {DAYS.map((weekDay) => {
          return (
            <Item
              item
              xs={1}
              key={weekDay}
              textAlign={'center'}
            >
              {weekDay}
            </Item>
          )
        })}

        {!!plansByDate && (
          new Array(numberOfWeeks).fill('').map((_, weekIndex) => (
            DAYS.map((_, dayIndex) => {
              const date = getDate(weekIndex, dayIndex, range[0])
              return (
                <GridItem
                  key={dayIndex}
                  date={date}
                  plans={plansByDate[date.date()]}
                />
              )
            })
          ))
        )}
      </Grid>
    </Container>
  )
}

export default GridContainer