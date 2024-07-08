import React, { useState, useEffect } from 'react'

import BattleSelector from './BattleSelector'
import TwoColumnList from './TwoColumnList'

import {
    Button,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'

import characters from './data/characters.json'
import saveFile from './data/Sv01d.e5s'
import person_addup from './data/person_addup.json'
import troop_HP_MP from './data/troop_HP_MP.json'
import troop from './data/troop.json'
import useLocalStorage from './useLocalStorage'
import items from './data/Item.json'
import { useDispatch, useSelector } from 'react-redux'
import { setSaveId } from './saveIdSlice'

const iconv = require('iconv-lite')

const App = () => {
    const dispatch = useDispatch()
    const battles = useSelector((state) => state.battles.battles)
    const battleId = useSelector((state) => state.battles.battleId)
    const redOrBlue = useSelector((state) => state.battles.redOrBlue)
    const saveId = useSelector((state) => state.saveId.id)

    const [level, setLevel] = useState(40)
    const [allCharacters, setAllCharacters] = useLocalStorage(
        'allCharacters',
        JSON.parse(JSON.stringify(characters.slice(0, 148)))
    )
    const [selectedCharacterIds, setSelectedCharacterIds] = useLocalStorage(
        'selected',
        [0]
    )
    const [binaryBuffer, setBinaryBuffer] = useState(null)

    useEffect(() => {
        const loadBinaryFile = async (filePath) => {
            const response = await fetch(filePath)
            const arrayBuffer = await response.arrayBuffer()
            setBinaryBuffer(arrayBuffer)
        }

        loadBinaryFile(saveFile)
    }, [])

    useEffect(() => {
        level_up_all(level)
    }, [level])

    // how many times 印绶 has been used
    // related to MP/HP, troop_type
    const getStampTimes = (level) => {
        if (level >= 30) {
            return 2
        }

        if (level >= 15) {
            return 1
        }

        return 0
    }

    const getTroopId = (troopType) => {
        return Math.floor(troopType / 3)
    }

    const getHP = (charId, level) => {
        let troopId = getTroopId(characters[charId].troop_type) // use original unchanged one
        let levelForHPMP = level + getStampTimes(level) * 2
        return (
            troop_HP_MP[troopId].initHP +
            (person_addup.hasOwnProperty(allCharacters[charId].name)
                ? person_addup[allCharacters[charId].name].HP
                : 0) +
            troop[allCharacters[charId].troop_type].HPIncre * levelForHPMP
        )
    }

    const getMP = (charId, level) => {
        let troopId = getTroopId(characters[charId].troop_type)
        let levelForHPMP = level + getStampTimes(level) * 2
        return (
            troop_HP_MP[troopId].initMP +
            (person_addup.hasOwnProperty(allCharacters[charId].name)
                ? person_addup[allCharacters[charId].name].MP
                : 0) +
            troop[allCharacters[charId].troop_type].MPIncre * levelForHPMP
        )
    }

    const capabilityIncreByTalent = (n) => {
        if (n >= 45) return 4
        if (n >= 35) return 3
        if (n >= 25) return 2
        return 1
    }
    const getCapability = (talent, troop, level) => {
        return (
            talent +
            Math.floor((capabilityIncreByTalent(talent) + troop) / 2) * level
        )
    }
    //
    const MIN_LEVEL = 1
    const MAX_LEVEL = 50
    const ITEM_START_ADDRESS = 0x57
    const CHAR_DATA_START = 0x14df
    const CHAR_LEN = 32
    const OFFSET_JOINED = 0
    const OFFSET_GONG = 1
    const OFFSET_FANG = 2
    const OFFSET_JING = 3
    const OFFSET_BAO = 4
    const OFFSET_SHI = 5
    const OFFSET_HP = 11
    const OFFSET_MP = 13
    const OFFSET_TROUP_TYPE = 14
    const OFFSET_LEVEL = 15
    const OFFSET_EXP = 16
    const STORE_ADDRESS = 0x02af

    const level_up = (item) => {
        // upgrade troop_type
        item.level = level
        item.exp = 0
        // only type <= 38 can be promoted
        item.troop_type =
            characters[item.id].troop_type +
            (characters[item.id].troop_type <= 38 ? getStampTimes(level) : 0)
        item.HP = getHP(item.id, level)
        item.MP = getMP(item.id, level)

        // wu -> gong
        item.gong = getCapability(
            item.wu,
            troop[item.troop_type].gongIncre,
            level
        )
        // tong -> fang, +2
        item.fang = getCapability(
            item.tong,
            troop[item.troop_type].fangIncre,
            level
        )

        // zhi -> jing, +3
        item.jing = getCapability(
            item.zhi,
            troop[item.troop_type].jingIncre,
            level
        )

        // min -> bao, +4
        item.bao = getCapability(
            item.min,
            troop[item.troop_type].baoIncre,
            level
        )

        // yun -> shi, +5
        item.shi = getCapability(
            item.yun,
            troop[item.troop_type].shiIncre,
            level
        )

        return item
    }

    const level_up_all = (l) => {
        let temp = [...allCharacters]
        for (let i = 0; i < temp.length; i++) {
            temp[i] = level_up(temp[i], l)
        }
        setAllCharacters(temp)
    }

    // write Chinese string to buffer
    const writeMsg = (view, position, msg) => {
        const encoded = iconv.encode(msg, 'gb18030')
        for (let i = 0; i < encoded.length; i++) {
            view.setUint8(position + i, encoded[i])
        }
        view.setUint8(position + encoded.length, 0x00) // terminate
    }

    const toChapter = (battleId) => {
        // 吕布包围战
        if (battleId <= 14) {
            return 1
        }

        // 河北之争，柳城平定战
        if (battleId <= 24) {
            return 2
        }

        // 三分天下
        // 红线博望坡到濡须口
        // 蓝线博望坡－马超，定军山到建业入侵
        if (battleId <= 34 || (battleId >= 46 && battleId <= 51)) {
            return 3
        }

        // 红线：天下统一，定军山到建业
        // 蓝线：魔王复活，鱼腹浦到五zhang原
        return 4
    }

    const modifyDFileBuffer = (buffer) => {
        const view = new DataView(buffer)

        // set which battle to play
        view.setInt8(0x3e, Math.floor(battleId / 10) * 20 + (battleId % 10) * 2)

        // set chapter, ordinary enemy soldiers do not upgrade to higher troop type in chapter 1 and 2
        view.setInt8(0x3d, toChapter(battleId))

        // set level in checkpoint name which decided by 曹操's level
        view.setInt8(0x01, allCharacters[0].level) //

        // set battle name, 0x05 - 0x19: 20bytes, battle name, “夺回汉中"
        writeMsg(view, 0x05, battles[battleId].name)

        // set location, 0x1b: location, "汉中 曹操军主营"
        writeMsg(view, 0x1b, '曹操军主营')

        view.setInt8(0x56, redOrBlue === 1 ? 100 : 0) // 0 蓝线，100 红线

        // top up money, 65535 should be enough
        view.setUint32(0x32, 0xffff, true)

        // fill up all items in store
        for (let i = 0; i < 17; i++) {
            view.setUint8(STORE_ADDRESS + i, 0xff)
        }
        // add special item 全宝
        let equipment_pointer = ITEM_START_ADDRESS
        items
            .filter((item) => item.type <= 62 && item.isSpecial === 1) // type > 62 are accs 辅助
            .forEach((item) => {
                view.setUint8(equipment_pointer, item.id)
                equipment_pointer += 1
                view.setUint8(equipment_pointer, item.type <= 13 ? 9 : 0) // only weapon and armor has level
                equipment_pointer += 1
                view.setUint8(equipment_pointer, 0xff) // exp 100
                equipment_pointer += 1

                // add another one
                view.setUint8(equipment_pointer, item.id)
                equipment_pointer += 1
                view.setUint8(equipment_pointer, item.type <= 13 ? 9 : 0) // only weapon and armor has level
                equipment_pointer += 1
                view.setUint8(equipment_pointer, 0xff) // exp 100
                equipment_pointer += 1
            })

        // remove all characters from our team
        for (let i = 0; i < 512; i++) {
            view.setInt8(CHAR_DATA_START + i * 32, 0xff)
        }

        // add characters to our team
        selectedCharacterIds.forEach((id) => {
            const item = allCharacters[id]
            const charAddr = CHAR_DATA_START + item.id * CHAR_LEN

            view.setInt8(charAddr + OFFSET_JOINED, 0x00)
            view.setInt8(charAddr + OFFSET_LEVEL, item.level)
            view.setInt8(charAddr + OFFSET_EXP, item.exp) // set all exp to 0, to stop level up at the begging of a battle
            view.setUint8(charAddr + OFFSET_TROUP_TYPE, item.troop_type)
            view.setUint16(charAddr + OFFSET_HP, item.HP, true) // true for little endian
            view.setUint8(charAddr + OFFSET_MP, item.MP)
            view.setUint8(charAddr + OFFSET_GONG, item.gong)
            view.setUint8(charAddr + OFFSET_FANG, item.fang)
            view.setUint8(charAddr + OFFSET_JING, item.jing)
            view.setUint8(charAddr + OFFSET_BAO, item.bao)
            view.setUint8(charAddr + OFFSET_SHI, item.shi)
            view.setUint8(charAddr + 17, item.weapon)
            view.setUint8(charAddr + 18, item.weaponLv)
            view.setUint8(charAddr + 19, item.weaponExp)
            view.setUint8(charAddr + 20, item.armor)
            view.setUint8(charAddr + 21, item.armorLv)
            view.setUint8(charAddr + 22, item.armorExp)
            view.setUint8(charAddr + 23, item.acc)
            view.setUint8(charAddr + 24, 0)
            view.setUint8(charAddr + 25, 0)
        })

        return buffer
    }

    const sortCharacters = (characters) => {
        characters.sort((a, b) => {
            if (a.id < b.id) {
                return -1
            }
            if (a.id > b.id) {
                return 1
            }
            return 0
        })
        return characters
    }

    const dFileName = (saveId) => {
        let checkpointFileId = saveId - 1
        return `Sv0${checkpointFileId}d.e5s`
    }

    const eFileName = (saveId) => {
        let checkpointFileId = saveId - 1
        return `Sv0${checkpointFileId}e.e5s`
    }

    const downloadFile = (name, buffer) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = name
        a.click()
        URL.revokeObjectURL(url)
    }

    const generateFile = () => {
        // d file
        downloadFile(dFileName(saveId), modifyDFileBuffer(binaryBuffer))

        // e file
        const eBuffer = new Uint8Array(10330).fill(0)
        eBuffer[0x2850] = battles[battleId].num_scenes - 2 // skip all scenes except for the last one to set 我军出场 properly

        // set variables
        const VAR_START_ADDR = 0x848
        const VAR_LEN = 4
        if (battles[battleId].hasOwnProperty('vars')) {
            battles[battleId].vars.forEach((item) => {
                eBuffer[VAR_START_ADDR + item * VAR_LEN] = 1
            })
        }
        downloadFile(eFileName(saveId), eBuffer)
    }

    return (
        <div>
            <Typography variant="h1" gutterBottom>
                曹操传 Battle Selector
            </Typography>

            <BattleSelector />

            <InputLabel id="levelLablel">Level: </InputLabel>
            <TextField
                id="level"
                type="number"
                // labelId="levelLabel"
                min={MIN_LEVEL}
                max={MAX_LEVEL}
                value={level}
                onChange={(event) => {
                    setLevel(parseInt(event.target.value))
                    setLevel(
                        Math.max(
                            MIN_LEVEL,
                            Math.min(MAX_LEVEL, Number(event.target.value))
                        )
                    )
                }}
            />

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

            <Button onClick={generateFile} variant="contained">
                Generate File
            </Button>

            <TwoColumnList
                // only display the first 149 characters, the rest are not very useful
                // data={characters.slice(0, 148)}
                data={allCharacters}
                selected={selectedCharacterIds}
                updateSelected={setSelectedCharacterIds}
                updateData={setAllCharacters}
            />
        </div>
    )
}

export default App
