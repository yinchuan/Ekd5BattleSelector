import { Button, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import BattleSelector from './features/battles/BattleSelector'
import Chacracters from './features/character/Characters'
import { setSaveId } from './features/saveId/saveIdSlice'

import { eFileName, dFileName, generateDFile, generateEFile } from './logic'
import { downloadFile } from './utils'

const App = () => {
    const dispatch = useDispatch()
    const battleId = useSelector((state) => state.battles.battleId)
    const redOrBlue = useSelector((state) => state.battles.redOrBlue)
    const saveId = useSelector((state) => state.saveId.id)
    const characters = useSelector((state) => state.characters.characters)
    const selectedIds = useSelector((state) => state.characters.selectedIds)

    return (
        <div>
            <Typography variant="h1" gutterBottom>
                曹操传 Battle Selector
            </Typography>

            <BattleSelector />

            <div>
                <InputLabel id="saveIdLabel">存档到： </InputLabel>
                <Select
                    id="saveId"
                    value={saveId}
                    onChange={(e) => dispatch(setSaveId(e.target.value))}
                >
                    {[...Array(10).keys()].map((n) => (
                        <MenuItem key={n + 1} value={n + 1}>
                            No. {n + 1}
                        </MenuItem>
                    ))}
                </Select>
                will store to {dFileName(saveId)} and {eFileName(saveId)}.
            </div>

            <Button
                onClick={() => {
                    downloadFile(
                        dFileName(saveId),
                        generateDFile(
                            battleId,
                            redOrBlue,
                            selectedIds,
                            characters
                        )
                    )
                    downloadFile(eFileName(saveId), generateEFile(battleId))
                }}
                variant="contained"
            >
                Generate File
            </Button>

            <Chacracters />
        </div>
    )
}

export default App
