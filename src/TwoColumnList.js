import React, { useState } from 'react'
import items from './data/Item.json'
import troop from './data/troop.json'

const TwoColumnList = ({ data, selected, updateSelected, updateData }) => {
    const handleLeftClick = (id) => {
        // add one to selected
        updateSelected([...selected, id].sort((a, b) => a - b))
    }

    const handleRightClick = (id) => {
        // always keep 曹操 selected
        if (id === 0) return
        updateSelected(selected.filter((item) => item !== id))
    }

    const updateWeapon = (charId, weaponId) => {
        let weapon = 0xff
        let weaponLv = 0
        let weaponExp = 0
        if (weaponId !== -1) {
            weapon = weaponId
            weaponLv = items[weaponId].isSpecial === 1 ? 9 : 3
            weaponExp = 0xff
        }
        updateData(
            data.map((iter) =>
                iter.id === charId
                    ? {
                          ...iter,
                          weapon: weapon,
                          weaponLv: weaponLv,
                          weaponExp: weaponExp,
                      }
                    : iter
            )
        )
    }

    const updateArmor = (charId, armorId) => {
        let armor = 0xff
        let armorLv = 0
        let armorExp = 0
        if (armorId !== -1) {
            armor = armorId
            armorLv = items[armorId].isSpecial === 1 ? 9 : 3
            armorExp = 0xff
        }
        updateData(
            data.map((iter) =>
                iter.id === charId
                    ? {
                          ...iter,
                          armor: armor,
                          armorLv: armorLv,
                          armorExp: armorExp,
                      }
                    : iter
            )
        )
    }
    const updateAcc = (charId, accId) => {
        const acc = accId === -1 ? 0 : accId
        updateData(
            data.map((iter) =>
                iter.id === charId ? { ...iter, acc: acc } : iter
            )
        )
    }

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
                <h3>Available Characters</h3>
                <ul>
                    {data
                        .filter((item) => !selected.includes(item.id))
                        .map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleLeftClick(item.id)}
                            >
                                {item.name}
                            </li>
                        ))}
                </ul>
            </div>
            <div style={{ flex: 1 }}>
                <h3>In Our Team({selected.length})</h3>
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Level</td>
                            <td>Weapon</td>
                            <td>Armor</td>
                            <td>Acc</td>
                            <td>HP</td>
                            <td>MP</td>
                            <td>gong</td>
                            <td>jing</td>
                            <td>fang</td>
                            <td>bao</td>
                            <td>shi</td>
                        </tr>
                    </thead>
                    <tbody>
                        {selected.map((id) => (
                            <tr>
                                <td onClick={() => handleRightClick(id)}>
                                    {data[id].name}
                                </td>
                                <td>{data[id].level}</td>
                                <td>
                                    <select
                                        value={data[id].weapon}
                                        onChange={(e) => {
                                            updateWeapon(
                                                id,
                                                parseInt(e.target.value)
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
                                                    troop[data[id].troop_type]
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
                                </td>
                                <td>
                                    <select
                                        value={data[id].armor}
                                        onChange={(e) => {
                                            updateArmor(
                                                id,
                                                parseInt(e.target.value)
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
                                                    troop[data[id].troop_type]
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
                                </td>
                                <td>
                                    <select
                                        value={data[id].acc}
                                        onChange={(e) => {
                                            updateAcc(
                                                id,
                                                parseInt(e.target.value)
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
                                                        data[id].troop_type / 3
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
                                </td>
                                <td>{data[id].HP}</td>
                                <td>{data[id].MP}</td>
                                <td>{data[id].gong}</td>
                                <td>{data[id].jing}</td>
                                <td>{data[id].fang}</td>
                                <td>{data[id].bao}</td>
                                <td>{data[id].shi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TwoColumnList
