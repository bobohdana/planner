import React from 'react'
import { useSelector } from 'react-redux'

import styled from '@emotion/styled'

import { Grid } from '@mui/material'

import { Context } from '../context/Context'
import GridItem from './GridItem'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const Container = styled.div`
  margin: 40px;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 10px 10px 40px 5px rgba(0,0,0,0.2);
`;

const Item = styled(Grid)`
  border-bottom: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  text-transform: uppercase;
  padding: 10px 5px;
  color: ${props =>
    props.today ? '#fff' : '#767676'};
  overflow: hidden;
  background-color: ${props =>
    props.today ? '#2e7d32' : 'none'};

  &:nth-of-type(7n) {
    border-right: none;
  }
`;

const GridContainer = () => {
  const [plansByDays, setPlansByDays] = React.useState(null)

  const { plans } = useSelector(state => state.plans)

  const { range } = React.useContext(Context)

  const getDate = (index) => {
    const date = new Date(range[0])
    return new Date(date.setDate(date.getDate() + index))
  }

  React.useEffect(() => {
    if (!!plans) {
      const _plans = {}
      plans.forEach((plan) => {
        const day = (new Date(plan.date).getDay() + 6) % 7
        _plans[day] = [
          ...(_plans[day] || []),
          plan,
        ]
      })

      setPlansByDays({..._plans})
    }
  }, [plans])

  return (
    <Container>
      <Grid container columns={{ xs: 7 }}>
        {DAYS.map((weekDay, index) => {
          const date = getDate(index)
          const today = new Date().toDateString() === date.toDateString()
          return (
            <Item
              item
              xs={1}
              key={weekDay}
              today={today}
              textAlign={'center'}
            >
              {weekDay}
            </Item>
          )
        })}

        {
          !!plansByDays && DAYS.map((d, index) => {
            const date = getDate(index)
            return (
              <GridItem
                key={index}
                date={date}
                plans={plansByDays[index]}
              />
            )
          })
        }
      </Grid>
    </Container>
  )
}

export default GridContainer