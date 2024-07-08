import {
    Box,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Typography,
} from '@mui/material'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { red, blue, selectBattle } from './battlesSlice'

const BattleSelector = () => {
    const dispatch = useDispatch()
    const battles = useSelector((state) => state.battles.battles)
    const redOrBlue = useSelector((state) => state.battles.redOrBlue)
    const battleId = useSelector((state) => state.battles.battleId)

    // used to show chapter before the first battle of the chapter
    const getChapter = (id) => {
        id = parseInt(id)
        const chapter = {
            0: 1,
            15: 2,
            25: 3,
            35: 4,
            52: 4,
        }
        return chapter.hasOwnProperty(id) ? chapter[id] : 0
    }

    return (
        <Box display="flex" alignItems="center">
            <Box display="flex" alignItems="center">
                <InputLabel htmlFor="color">选择剧情:</InputLabel>
                <RadioGroup name="color" defaultValue={redOrBlue}>
                    <Box>
                        <FormControlLabel
                            control={<Radio />}
                            label="红线"
                            value={1}
                            onChange={() => {
                                dispatch(red())
                            }}
                        />
                        <FormControlLabel
                            control={<Radio />}
                            label="蓝线"
                            value={2}
                            onChange={() => {
                                dispatch(blue())
                            }}
                        />
                    </Box>
                </RadioGroup>
            </Box>

            <Divider orientation="vertical" sx={{ marginRight: 1 }} />

            <FormControl size="small">
                <Select
                    id="battle"
                    onChange={(e) => dispatch(selectBattle(e.target.value))}
                    value={battleId}
                >
                    {Object.keys(battles)
                        // show battles in red line or blue line
                        .filter(
                            (key) => (battles[key].redOrBlue & redOrBlue) !== 0
                        )
                        .map((key) => {
                            const battleItem = (
                                <MenuItem key={key} value={key}>
                                    {battles[key].name}
                                </MenuItem>
                            )
                            const chapter = getChapter(key)

                            return chapter > 0
                                ? [
                                      <Typography variant="h6">
                                          Chapter {chapter}
                                      </Typography>,
                                      battleItem,
                                  ]
                                : battleItem
                        })}
                </Select>
            </FormControl>
        </Box>
    )
}

export default BattleSelector
