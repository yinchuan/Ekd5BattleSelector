import troop_HP_MP from './data/troop_HP_MP.json'
import person_addup from './data/person_addup.json'
import troop from './data/troop.json'
// need to remove this
import characters from './data/characters.json'

export const level_up = (character, level) => {
    // promote troop_type, only type <= 38 can be promoted
    character.level = level
    character.exp = 0
    character.troop_type =
        characters[character.id].troop_type +
        (characters[character.id].troop_type <= 38 ? getStampTimes(level) : 0)
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
export const getStampTimes = (level) => {
    if (level >= 30) {
        return 2
    }

    if (level >= 15) {
        return 1
    }

    return 0
}

export const getHP = (charId, level) => {
    let troopId = getTroopId(characters[charId].troop_type) // use original unchanged one
    let levelForHPMP = level + getStampTimes(level) * 2
    return (
        troop_HP_MP[troopId].initHP +
        (person_addup.hasOwnProperty(characters[charId].name)
            ? person_addup[characters[charId].name].HP
            : 0) +
        troop[characters[charId].troop_type].HPIncre * levelForHPMP
    )
}

export const getMP = (charId, level) => {
    let troopId = getTroopId(characters[charId].troop_type)
    let levelForHPMP = level + getStampTimes(level) * 2
    return (
        troop_HP_MP[troopId].initMP +
        (person_addup.hasOwnProperty(characters[charId].name)
            ? person_addup[characters[charId].name].MP
            : 0) +
        troop[characters[charId].troop_type].MPIncre * levelForHPMP
    )
}

export const getTroopId = (troopType) => {
    return Math.floor(troopType / 3)
}

export const capabilityIncreByTalent = (n) => {
    if (n >= 45) return 4
    if (n >= 35) return 3
    if (n >= 25) return 2
    return 1
}

export const getCapability = (talent, troop, level) => {
    return (
        talent +
        Math.floor((capabilityIncreByTalent(talent) + troop) / 2) * level
    )
}
