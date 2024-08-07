import {
    Box,
    Button,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material'

import BattleSelector from './features/battles/BattleSelector'
import Chacracters from './features/character/Characters'
import { setSaveId } from './features/saveId/saveIdSlice'

import { eFileName, dFileName, generateDFile, generateEFile } from './logic'
import { downloadFile } from './utils'
import { useAppDispatch, useAppSelector } from './app/hooks'

const App: React.FC = () => {
    const dispatch = useAppDispatch()
    const battleId = useAppSelector((state) => state.battles.battleId)
    const redOrBlue = useAppSelector((state) => state.battles.redOrBlue)
    const saveId = useAppSelector((state) => state.saveId.id)
    const characters = useAppSelector((state) => state.characters.characters)
    const selectedIds = useAppSelector((state) => state.characters.selectedIds)

    return (
        <div>
            <Box display="flex" justifyContent="center">
                <Typography variant="h4" component="h1">
                    曹操传 Battle Selector
                </Typography>
            </Box>

            <Box display="flex" alignItems="center">
                <BattleSelector />

                <Divider orientation="vertical" flexItem sx={{ margin: 2 }} />

                <Box display="flex" alignItems="center">
                    <FormControl size="small">
                        <InputLabel htmlFor="saveId">存档到： </InputLabel>
                        <Select
                            id="saveId"
                            value={saveId}
                            onChange={(e) =>
                                dispatch(setSaveId(e.target.value))
                            }
                        >
                            {[...Array(10).keys()].map((n) => (
                                <MenuItem key={n + 1} value={n + 1}>
                                    No. {n + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Divider
                        orientation="horizontal"
                        sx={{ margin: 1 }}
                    ></Divider>
                    will store to
                    <Box mx={0.5}>
                        <Typography fontWeight="bold">
                            {dFileName(saveId)}
                        </Typography>
                    </Box>
                    and
                    <Box mx={0.5}>
                        <Typography fontWeight="bold">
                            {eFileName(saveId)}
                        </Typography>
                    </Box>
                    .
                </Box>

                <Divider orientation="vertical" sx={{ margin: 1 }} />

                <Button
                    onClick={() => {
                        generateDFile(
                            battleId,
                            redOrBlue,
                            selectedIds,
                            characters
                        ).then((buffer) =>
                            downloadFile(dFileName(saveId), buffer)
                        )
                        downloadFile(eFileName(saveId), generateEFile(battleId))
                    }}
                    variant="contained"
                >
                    Generate File
                </Button>
            </Box>

            <Divider
                sx={{
                    marginTop: 2,
                    marginBottom: 2,
                }}
            ></Divider>

            <Chacracters />
        </div>
    )
}

export default App
