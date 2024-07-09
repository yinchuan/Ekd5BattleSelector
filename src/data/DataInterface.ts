export interface BattleData {
    [key: string]: {
        name: string
        redOrBlue: number
        num_scenes: number
        vars?: number[]
    }
}

export interface PersonAddupData {
    [key: string]: {
        HP: number
        MP: number
    }
}

export interface CharacterData {
    id: number
    name: string
    wu: number
    tong: number
    zhi: number
    min: number
    yun: number
    HP: number
    MP: number
    troop_type: number
    belongTo: string
    level: number
    weapon: number
    weaponLv: number
    weaponExp: number
    armor: number
    armorLv: number
    armorExp: number
    acc: number
    gong: number
    jing: number
    fang: number
    bao: number
    shi: number
}
