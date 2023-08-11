import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from '@emotion/styled'
import dayjs, { Dayjs } from 'dayjs'

import { useAppDispatch, useAppSelector } from '../hooks'

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

import { IPlan } from '../interfaces'

interface GridItemProps {
  plans: IPlan[],
  date: Dayjs
}

const GridItem: FC<GridItemProps> = ({ plans, date }) => {
  const { sortedBy, range: [firstDate] } = React.useContext(Context)
  const auth = React.useContext(AuthContext)

  const week = sortedBy === 'week'
  const { loading }: { loading: boolean } = useAppSelector(props => props.plans)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const openDetails = (id: string) => {
    navigate(`${id}`)
  }

  const changeCompletion = (plan: IPlan) => {
    dispatch(updatePlan({ auth,
      plan: { 
        ...plan,
        isCompleted: !plan.isCompleted
      }
    }))
  }

  const dayNumber = date.date()
  const today = date.valueOf() === dayjs().startOf('day').valueOf()
  const minor = !week && date.month() != dayjs(firstDate).month()

  return (
    <GridBlock
      item
      xs={1}
      css={getCss(minor, today, week)}
    >
      <Day>{dayNumber}</Day>

      {loading ? (
        <Skeleton variant="rectangular" height={'86%'} animation="wave" />
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
    </GridBlock>
  )
}

const getCss = (minor: boolean, today: boolean, week: boolean) => ({
  border: today ? '4px solid #5db361' : '',
  color: minor ? '#cecbcb' : '#767676',
  bgColor: minor ? '#efefef' : '',
  height: week ? '400px' : '200px',
})

interface BlockProps {
  css: {
    [key: string]: string,
  },
}
const Block = styled('div')<BlockProps>`
  border-bottom: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  padding-bottom: 6px;
  overflow: hidden;

  height: ${props => props.css.height};
  background-color: ${props => props.css.bgColor};
  border: ${props => props.css.border};
  color: ${props => props.css.color};

  &:nth-of-type(7n) {
    border-right: none;
  }
`;
const GridBlock = Block.withComponent(Grid)

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

interface ItemProps {
  isCompleted: boolean
}
const Item = styled.div<ItemProps>`
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