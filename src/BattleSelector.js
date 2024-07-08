import {
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

const BattleSelector = ({ data }) => {
    const dispatch = useDispatch()
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
        <div>
            <InputLabel id="colorLabel">选择剧情：</InputLabel>
            <RadioGroup name="color" defaultValue={redOrBlue}>
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
            </RadioGroup>

            <InputLabel id="battleLabel">关卡: </InputLabel>
            <Select
                labelId="battleLabel"
                onChange={(e) => dispatch(selectBattle(e.target.value))}
                value={battleId}
            >
                {Object.keys(data).map((key) => {
                    // show battles in red line or blue line
                    if ((data[key].redOrBlue & redOrBlue) === 0) {
                        return
                    }

                    const battleItem = (
                        <MenuItem key={key} value={key}>
                            {data[key].name}
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
        </div>
    )
}

export default BattleSelector
