import troop_HP_MP from './data/troop_HP_MP.json'
import troop from './data/troop.json'
import items from './data/Item.json'
import dFile from './data/Sv01d.e5s'
import { writeMsg } from './utils'
import {
    BattleData,
    CharacterData,
    PersonAddupData,
} from './data/DataInterface'

const battles: BattleData = require('./data/battles.json')
const person_addup: PersonAddupData = require('./data/person_addup.json')
const unChangedCharacters: CharacterData[] = require('./data/characters.json')

export const level_up = (character: any, level: number) => {
    // promote troop_type, only type <= 38 can be promoted
    character.level = level
    character.exp = 0
    character.troop_type =
        unChangedCharacters[character.id].troop_type +
        (unChangedCharacters[character.id].troop_type <= 38
            ? getStampTimes(level)
            : 0)
    character.HP = getHP(character.id, level)
    character.MP = getMP(character.id, level)

    // wu -> gong
    character.gong = getCapability(
        character.wu,
        troop[character.troop_type].gongIncre,
        level
    )
    // tong -> fang, +2
    character.fang = getCapability(
        character.tong,
        troop[character.troop_type].fangIncre,
        level
    )

    // zhi -> jing, +3
    character.jing = getCapability(
        character.zhi,
        troop[character.troop_type].jingIncre,
        level
    )

    // min -> bao, +4
    character.bao = getCapability(
        character.min,
        troop[character.troop_type].baoIncre,
        level
    )

    // yun -> shi, +5
    character.shi = getCapability(
        character.yun,
        troop[character.troop_type].shiIncre,
        level
    )

    return character
}

// how many times 印绶 has been used
// related to MP/HP, troop_type
const getStampTimes = (level: number) => {
    if (level >= 30) {
        return 2
    }

    if (level >= 15) {
        return 1
    }

    return 0
}

const getHP = (charId: number, level: number) => {
    let troopId = getTroopId(unChangedCharacters[charId].troop_type) // use original unchanged one
    let levelForHPMP = level + getStampTimes(level) * 2
    return (
        troop_HP_MP[troopId].initHP +
        (person_addup.hasOwnProperty(unChangedCharacters[charId].name)
            ? person_addup[unChangedCharacters[charId].name].HP
            : 0) +
        troop[unChangedCharacters[charId].troop_type].HPIncre * levelForHPMP
    )
}

const getMP = (charId: number, level: number) => {
    let troopId = getTroopId(unChangedCharacters[charId].troop_type)
    let levelForHPMP = level + getStampTimes(level) * 2
    return (
        troop_HP_MP[troopId].initMP +
        (person_addup.hasOwnProperty(unChangedCharacters[charId].name)
            ? person_addup[unChangedCharacters[charId].name].MP
            : 0) +
        troop[unChangedCharacters[charId].troop_type].MPIncre * levelForHPMP
    )
}

const getTroopId = (troopType: number) => {
    return Math.floor(troopType / 3)
}

const capabilityIncreByTalent = (n: number) => {
    if (n >= 45) return 4
    if (n >= 35) return 3
    if (n >= 25) return 2
    return 1
}

const getCapability = (talent: number, troop: number, level: number) => {
    return (
        talent +
        Math.floor((capabilityIncreByTalent(talent) + troop) / 2) * level
    )
}

const toChapter = (battleId: number) => {
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

export const generateDFile = async (
    battleId: number,
    redOrBlue: number,
    selectedIds: number[],
    characters: any
) => {
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
    const NUM_CONSUMABLE_ITEMS = 17
    const OFFSET_BATTLES_TIMES = 24
    const OFFSET_DIE_TIMES = 25

    // load binary file
    console.log(dFile)
    const response = await fetch(dFile)
    const buffer = await response.arrayBuffer()
    const view = new DataView(buffer)

    // set which battle to play
    view.setInt8(0x3e, encodeBattleId(battleId))

    // set chapter, ordinary enemy soldiers do not upgrade to higher troop type in chapter 1 and 2
    view.setInt8(0x3d, toChapter(battleId))

    // set level in checkpoint name which decided by 曹操's level
    view.setInt8(0x01, unChangedCharacters[0].level) //

    // set battle name, 0x05 - 0x19: 20bytes, battle name, “夺回汉中"
    writeMsg(view, 0x05, battles[battleId].name)

    // set location, 0x1b: location, "汉中 曹操军主营"
    writeMsg(view, 0x1b, '曹操军主营')

    view.setInt8(0x56, redOrBlue === 1 ? 100 : 0) // 0 蓝线，100 红线

    // top up money, 65535 should be enough
    view.setUint32(0x32, 0xffff, true)

    // fill up(255) all items in store
    for (let i = 0; i < NUM_CONSUMABLE_ITEMS; i++) {
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
    selectedIds.forEach((id) => {
        const character = characters[id]
        const charAddr = CHAR_DATA_START + character.id * CHAR_LEN

        view.setInt8(charAddr + OFFSET_JOINED, 0x00)
        view.setInt8(charAddr + OFFSET_LEVEL, character.level)
        view.setInt8(charAddr + OFFSET_EXP, character.exp) // set all exp to 0, to stop level up at the begging of a battle
        view.setUint8(charAddr + OFFSET_TROUP_TYPE, character.troop_type)
        view.setUint16(charAddr + OFFSET_HP, character.HP, true) // true for little endian
        view.setUint8(charAddr + OFFSET_MP, character.MP)
        view.setUint8(charAddr + OFFSET_GONG, character.gong)
        view.setUint8(charAddr + OFFSET_FANG, character.fang)
        view.setUint8(charAddr + OFFSET_JING, character.jing)
        view.setUint8(charAddr + OFFSET_BAO, character.bao)
        view.setUint8(charAddr + OFFSET_SHI, character.shi)
        view.setUint8(charAddr + 17, character.weapon)
        view.setUint8(charAddr + 18, character.weaponLv)
        view.setUint8(charAddr + 19, character.weaponExp)
        view.setUint8(charAddr + 20, character.armor)
        view.setUint8(charAddr + 21, character.armorLv)
        view.setUint8(charAddr + 22, character.armorExp)
        view.setUint8(charAddr + 23, character.acc)
        view.setUint8(charAddr + OFFSET_BATTLES_TIMES, 0)
        view.setUint8(charAddr + OFFSET_DIE_TIMES, 0)
    })

    return buffer
}

export const generateEFile = (battleId: number) => {
    const EFILE_SIZE = 10330
    const OFF_R_SCENE_SECTION_ID = 0x2850
    const OFF_VAR_START = 0x848
    const VAR_LEN = 4

    // e file
    const buffer = new Uint8Array(EFILE_SIZE).fill(0)
    buffer[OFF_R_SCENE_SECTION_ID] = battles[battleId].num_scenes - 2 // skip all scenes except for the last one to set 我军出场 properly

    // set variables
    battles[battleId].vars &&
        battles[battleId].vars.forEach((item) => {
            buffer[OFF_VAR_START + item * VAR_LEN] = 1
        })

    return buffer
}

const sortCharacters = (characters: CharacterData[]) => {
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

export const dFileName = (saveId: number) => {
    return `Sv0${saveId - 1}d.e5s`
}

export const eFileName = (saveId: number) => {
    return `Sv0${saveId - 1}e.e5s`
}

const encodeBattleId = (battleId: number) => {
    return Math.floor(battleId / 10) * 20 + (battleId % 10) * 2
}
