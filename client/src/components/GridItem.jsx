import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import styled from '@emotion/styled'
import dayjs from 'dayjs'

import {
  Checkbox as MUICheckbox,
  Skeleton as MUISkeleton,
  Grid
} from '@mui/material'

import { 
  CircleOutlined,
  CheckCircleOutlined,
} from '@mui/icons-material'

import { AuthContext } from '../context/AuthContext'
import { Context } from '../context/Context'
import { updatePlan } from '../store/PlanSlice'

const GridItem = ({ plans, date }) => {
  const { sortedBy, range: [firstDate] } = React.useContext(Context)
  const auth = React.useContext(AuthContext)

  const isWeek = sortedBy === 'week'
  const { loading } = useSelector(props => props.plans)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const openDetails = (id) => {
    navigate(`${id}`)
  }

  const changeCompletion = (plan) => {
    dispatch(updatePlan({ auth,
      plan: { 
        ...plan,
        isCompleted: !plan.isCompleted
      }
    }))
  }

  const dayNumber = date.getDate()
  const today = date.getTime() === new Date(dayjs().startOf('day')).getTime()
  const minor = !isWeek && date.getMonth() != dayjs(firstDate).month()

  return (
    <Block item xs={1} isWeek={isWeek} minor={minor} today={today}>
      <Day today={today}>{dayNumber}</Day>

      {loading ? (
        <Skeleton variant="rectangular" height={'90%'} />
      ) : (
        <Container>
          {!!plans && !minor && plans.map(plan => {
            const { _id, isCompleted, text } = plan
            return (
              <ItemRoot key={_id}>
                <Checkbox
                  size='small'
                  disableRipple
                  checked={isCompleted}
                  onChange={() => changeCompletion(plan)}
                  icon={<CircleOutlined />}
                  checkedIcon={<CheckCircleOutlined color='success' />}
                />

                <Item
                  isCompleted={isCompleted}
                  onClick={() => openDetails(_id)}
                >
                  <Text>{text}</Text>
                </Item>
              </ItemRoot>
            )
          })}
        </Container>
      )}
    </Block>
  )
}


const Block = styled(Grid)`
  border-bottom: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  padding-bottom: 6px;
  overflow: hidden;
  height: ${props => 
    props.isWeek ? '400px' : '200px'
  };
  background-color: ${props => 
    props.minor ? '#efefef' : ''
  };
  border: ${props => 
    props.today ? '4px solid #5db361' : ''
  };
  color: ${props => 
    props.minor ? '#cecbcb' : '#767676'
  };

  &:nth-of-type(7n) {
    border-right: none;
  }
`;

const Container = styled.div`
  overflow-y: scroll;
  max-height: 90%;
`;

const Skeleton = styled(MUISkeleton)`
  border-radius: 5px;
  margin: 5px;
`;

const Day = styled.p`
  margin-right: 6px;
  text-align: end;
`;

const ItemRoot = styled.div`
  position: relative;
`;

const Checkbox = styled(MUICheckbox)`
  position: absolute !important;
  z-index: 10;
  padding: 0 !important;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 5px 5px 5px 24px;
  overflow-wrap: anywhere;
  margin-right: 10px;
  background-color: ${props => 
    props.isCompleted ? '#f0f0f0' : '#c2edc2'
  };
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
  min-height: 20px;
`;

const Text = styled.p`
  display: -webkit-box;
  overflow: hidden;
  margin-left: 5px;
  white-space: pre-wrap;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
`;

export default GridItem