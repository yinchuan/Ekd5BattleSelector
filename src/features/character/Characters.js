import { InputLabel, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setAllLevel } from './charactersSlice'

import InOurTeam from './InOurTeam'
import AvailableChracters from './AvailableChracters'

const Chacracters = () => {
    const dispatch = useDispatch()
    const level = useSelector((state) => state.characters.level)

    const MIN_LEVEL = 1
    const MAX_LEVEL = 50

    return (
        <div>
            <InputLabel id="levelLablel">Level: </InputLabel>
            <TextField
                id="level"
                type="number"
                min={MIN_LEVEL}
                max={MAX_LEVEL}
                value={level}
                onChange={(event) => {
                    dispatch(setAllLevel(event.target.value))
                }}
            />

            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <AvailableChracters />
                </div>
                <div style={{ flex: 2 }}>
                    <InOurTeam />
                </div>
            </div>
        </div>
    )
}

export default Chacracters
