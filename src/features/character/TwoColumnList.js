import React, { useEffect, useState } from 'react'
import items from '../../data/Item.json'
import troop from '../../data/troop.json'
import {
    InputLabel,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
    select,
    deSelect,
    updateWeapon,
    updateArmor,
    updateAcc,
    setAllLevel,
} from './charactersSlice'

const TwoColumnList = () => {
    const dispatch = useDispatch()
    const level = useSelector((state) => state.characters.level)
    const characters = useSelector((state) => state.characters.characters)
    const selectedIds = useSelector((state) => state.characters.selectedIds)

    const [activeTab, setActiveTab] = useState(0)
    const [belongs, setBelongs] = useState([])

    useEffect(() => {
        setBelongs([...new Set(characters.map((item) => item.belongTo))])
    }, [characters])

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
                    <Typography variant="h4">Available Characters</Typography>
                    <Tabs
                        value={activeTab}
                        onChange={(event, newValue) => setActiveTab(newValue)}
                    >
                        {belongs.map((belong) => (
                            <Tab label={`${belong}`} id={`tab-${belong}`} />
                        ))}
                    </Tabs>
                    {(() => {
                        const temp = []
                        for (let i = 0; i < belongs.length; i++) {
                            temp.push(
                                <div
                                    role="tabpanel"
                                    index={i}
                                    hidden={activeTab !== i}
                                    id={`tab-${belongs[i]}`}
                                >
                                    <ul>
                                        {characters
                                            .filter(
                                                (item) =>
                                                    !selectedIds.includes(
                                                        item.id
                                                    ) &&
                                                    item.belongTo === belongs[i]
                                            )
                                            .map((item) => (
                                                <li
                                                    key={item.id}
                                                    onClick={() =>
                                                        dispatch(
                                                            select(item.id)
                                                        )
                                                    }
                                                >
                                                    {item.name}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )
                        }
                        return temp
                    })()}
                </div>
                <div style={{ flex: 2 }}>
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
                                    <TableCell
                                        onClick={() => dispatch(deSelect(id))}
                                    >
                                        {characters[id].name}
                                    </TableCell>
                                    <TableCell>
                                        {troop[characters[id].troop_type].name}
                                    </TableCell>
                                    <TableCell>
                                        {characters[id].level}
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
                                                        troop[
                                                            characters[id]
                                                                .troop_type
                                                        ].canUseItem[item.type]
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
                                                        troop[
                                                            characters[id]
                                                                .troop_type
                                                        ].canUseItem[item.type]
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
                                                        accId: parseInt(
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
                                                        item.type >= 18 &&
                                                        item.type <= 62 &&
                                                        (Math.floor(
                                                            characters[id]
                                                                .troop_type / 3
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
            </div>
        </div>
    )
}

export default TwoColumnList
