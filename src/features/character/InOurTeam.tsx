import items from '../../data/Item.json'
import troop from '../../data/troop.json'
import {
    deSelect,
    updateWeapon,
    updateArmor,
    updateAcc,
} from './charactersSlice'
import {
    Box,
    InputLabel,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { setAllLevel, setLevel, setSameLevelForAll } from './charactersSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

const InOurTeam: React.FC = () => {
    const dispatch = useAppDispatch()
    const characters = useAppSelector((state) => state.characters.characters)
    const selectedIds = useAppSelector((state) => state.characters.selectedIds)
    const level = useAppSelector((state) => state.characters.level)
    const sameLevelForAll = useAppSelector(
        (state) => state.characters.sameLevelForAll
    )

    const MIN_LEVEL = 1
    const MAX_LEVEL = 50

    return (
        <div>
            <Typography variant="h5">
                In Our Team({selectedIds.length})
            </Typography>

            <Box display="flex" alignItems="center">
                <Switch
                    checked={sameLevelForAll}
                    onChange={(event) => {
                        dispatch(setSameLevelForAll(event.target.checked))
                        dispatch(setAllLevel(level))
                    }}
                />
                <InputLabel htmlFor="level">
                    All characters have the same level:{' '}
                </InputLabel>
                <TextField
                    id="level"
                    type="number"
                    size="small"
                    // min={MIN_LEVEL}
                    // max={MAX_LEVEL}
                    value={level}
                    onChange={(event) => {
                        dispatch(setAllLevel(event.target.value))
                    }}
                    sx={{ width: '6ch' }}
                    disabled={!sameLevelForAll}
                />
            </Box>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Troop</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell>Weapon</TableCell>
                        <TableCell>Armor</TableCell>
                        <TableCell>Acc</TableCell>
                        <TableCell>HP</TableCell>
                        <TableCell>MP</TableCell>
                        <TableCell>gong</TableCell>
                        <TableCell>jing</TableCell>
                        <TableCell>fang</TableCell>
                        <TableCell>bao</TableCell>
                        <TableCell>shi</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {selectedIds.map((id) => (
                        <TableRow>
                            <TableCell onClick={() => dispatch(deSelect(id))}>
                                {characters[id].name}
                            </TableCell>
                            <TableCell>
                                {troop[characters[id].troop_type].name}
                            </TableCell>
                            <TableCell>
                                <TextField
                                    id={`${id}-level`}
                                    type="number"
                                    size="small"
                                    // min={MIN_LEVEL}
                                    // max={MAX_LEVEL}
                                    value={characters[id].level}
                                    onChange={(event) => {
                                        dispatch(
                                            setLevel({
                                                charId: id,
                                                level: parseInt(
                                                    event.target.value
                                                ),
                                            })
                                        )
                                    }}
                                    inputProps={{
                                        width: '6ch',
                                        style: { padding: 0 },
                                    }}
                                    disabled={sameLevelForAll}
                                />
                            </TableCell>
                            <TableCell>
                                <select
                                    value={characters[id].weapon}
                                    onChange={(e) => {
                                        dispatch(
                                            updateWeapon({
                                                charId: id,
                                                weaponId: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        )
                                    }}
                                >
                                    <option key={id + '-1'} value="-1">
                                        -
                                    </option>
                                    {items
                                        .filter(
                                            (item) =>
                                                item.type <= 13 &&
                                                troop[characters[id].troop_type]
                                                    .canUseItem[item.type]
                                        )
                                        .map((item) => (
                                            <option
                                                key={id + '_' + item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </TableCell>
                            <TableCell>
                                <select
                                    value={characters[id].armor}
                                    onChange={(e) => {
                                        dispatch(
                                            updateArmor({
                                                charId: id,
                                                armorId: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        )
                                    }}
                                >
                                    <option key={id + '-1'} value="-1">
                                        -
                                    </option>
                                    {items
                                        .filter(
                                            (item) =>
                                                item.type > 13 &&
                                                item.type <= 17 &&
                                                troop[characters[id].troop_type]
                                                    .canUseItem[item.type]
                                        )
                                        .map((item) => (
                                            <option
                                                key={id + '_' + item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </TableCell>
                            <TableCell>
                                <select
                                    value={characters[id].acc}
                                    onChange={(e) => {
                                        dispatch(
                                            updateAcc({
                                                charId: id,
                                                accId: parseInt(e.target.value),
                                            })
                                        )
                                    }}
                                >
                                    <option key={id + '-1'} value="-1">
                                        -
                                    </option>
                                    {items
                                        .filter(
                                            (item) =>
                                                item.type >= 18 &&
                                                item.type <= 62 &&
                                                (Math.floor(
                                                    characters[id].troop_type /
                                                        3
                                                ) === item.incre ||
                                                    item.incre === 255)
                                        )
                                        .map((item) => (
                                            <option
                                                key={id + '_' + item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </TableCell>
                            <TableCell>{characters[id].HP}</TableCell>
                            <TableCell>{characters[id].MP}</TableCell>
                            <TableCell>{characters[id].gong}</TableCell>
                            <TableCell>{characters[id].jing}</TableCell>
                            <TableCell>{characters[id].fang}</TableCell>
                            <TableCell>{characters[id].bao}</TableCell>
                            <TableCell>{characters[id].shi}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default InOurTeam
