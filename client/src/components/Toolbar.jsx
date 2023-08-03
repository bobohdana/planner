import React from 'react'

import styled from '@emotion/styled'

import {
  Toolbar as MUIToolbar,
  IconButton,
  MenuItem,
  Button,
  Select,
  Stack,
} from '@mui/material'

import { NavigateBefore, NavigateNext } from '@mui/icons-material';

import { Context } from '../context/Context'
import { toShortFormat } from '../utils';

const RangeContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  align-items: center;
`;

const Typography = styled.p`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 10px;
`;

const Toolbar = () => {
  const {
    range,
    setPageIndex,

    sortedBy,
    changeSortedBy,

    nextPage,
    previousPage,
  } = React.useContext(Context)
  
  const [start, end] = toShortFormat(range)

  const moveToToday = () => {
    setPageIndex(0)
  }

  return (
    <MUIToolbar>
      <Stack direction='row' spacing={4}>
        <Button
          variant='outlined'
          color='success'
          onClick={moveToToday}
          // disabled={true}
        >
          Today
        </Button>

        <Select
          color='success'
          value={sortedBy}
          onChange={changeSortedBy}
          defaultValue={'week'}
          disabled={true}
        >
          <MenuItem value={'week'}>Week</MenuItem> 
          <MenuItem value={'month'}>Month</MenuItem>
        </Select>
      </Stack>

      <RangeContainer>
        <IconButton fontSize='large' onClick={previousPage}>
          <NavigateBefore fontSize='large' color='success' />
        </IconButton>
        <Typography>{start} - {end}</Typography>
        <IconButton fontSize='large' onClick={nextPage}>
          <NavigateNext fontSize='large' color='success' />
        </IconButton>
      </RangeContainer>
    </MUIToolbar>
  )
}

export default Toolbar