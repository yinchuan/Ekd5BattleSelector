import items from '../../data/Item.json'
import troop from '../../data/troop.json'
import { useDispatch, useSelector } from 'react-redux'
import {
    deSelect,
    updateWeapon,
    updateArmor,
    updateAcc,
} from './charactersSlice'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'

const InOurTeam = () => {
    const dispatch = useDispatch()
    const characters = useSelector((state) => state.characters.characters)
    const selectedIds = useSelector((state) => state.characters.selectedIds)

    return (
        <div>
            <Typography variant="h4">
                In Our Team({selectedIds.length})
            </Typography>
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
                            <TableCell>{characters[id].level}</TableCell>
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
