import { InputLabel, Menu, MenuItem, Select, Typography } from '@mui/material'
import React from 'react'

const BattleSelector = ({ data, redOrBlue, battleId, onChange }) => {
    const handleSelect = (event) => {
        onChange(event.target.value)
    }

    // used to show chapter before the first battle of the chapter
    const chapter = {
        0: 1,
        15: 2,
        25: 3,
        35: 4,
        52: 4,
    }

    return (
        <div>
            <InputLabel id="battleLabel">关卡: </InputLabel>
            <Select
                labelId="battleLabel"
                onChange={handleSelect}
                value={battleId}
            >
                {Object.keys(data).map((key) => {
                    // show battles in red line or blue line
                    if ((data[key].redOrBlue & redOrBlue) === 0) {
                        return
                    }

                    // always render battle
                    const battleItem = (
                        <MenuItem key={key} value={key}>
                            {data[key].name}
                        </MenuItem>
                    )

                    return chapter.hasOwnProperty(parseInt(key))
                        ? [
                              <Typography variant="h6">
                                  Chapte {chapter[parseInt(key)]}
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
