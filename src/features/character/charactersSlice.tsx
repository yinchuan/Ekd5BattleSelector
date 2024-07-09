import { createSlice } from '@reduxjs/toolkit'
import items from '../../data/Item.json'
import { level_up } from '../../logic'
import { CharacterData } from '../../data/DataInterface'

const characters: CharacterData[] = require('../../data/characters.json')

const MIN_LEVEL = 1
const MAX_LEVEL = 50
const DEFAULT_LEVEL = 40

interface ChacracterState {
    characters: CharacterData[]
    selectedIds: number[]
    level: number
    sameLevelForAll: boolean
    belongs: string[]
}

const initialState: ChacracterState = {
    // only use the first 148 characeters, the rest are not quite useful
    characters: JSON.parse(JSON.stringify(characters.slice(0, 148))).map(
        (c: CharacterData) => {
            return level_up(c, DEFAULT_LEVEL)
        }
    ),
    selectedIds: [0], // select caocao by default
    level: DEFAULT_LEVEL,
    sameLevelForAll: true,
    belongs: [...new Set(characters.map((c) => c.belongTo))],
}

const charactersSlice = createSlice({
    name: 'characters',
    initialState,
    reducers: {
        select: (state, action) => {
            // add one id to selectedIds, and sort by id in ascending order
            state.selectedIds = [...state.selectedIds, action.payload].sort(
                (a, b) => a - b
            )
        },
        deSelect: (state, action) => {
            // always keep 曹操 selected
            if (action.payload === 0) return
            state.selectedIds = state.selectedIds.filter(
                (item) => item !== action.payload
            )
        },
        updateWeapon: (state, action) => {
            const { weaponId, charId } = action.payload
            let weapon = 0xff
            let weaponLv = 0
            let weaponExp = 0
            if (weaponId !== -1) {
                weapon = weaponId
                weaponLv = items[weaponId].isSpecial === 1 ? 9 : 3
                weaponExp = 0xff
            }
            state.characters[charId].weapon = weapon
            state.characters[charId].weaponLv = weaponLv
            state.characters[charId].weaponExp = weaponExp
        },
        updateArmor: (state, action) => {
            const { armorId, charId } = action.payload
            let armor = 0xff
            let armorLv = 0
            let armorExp = 0
            if (armorId !== -1) {
                armor = armorId
                armorLv = items[armorId].isSpecial === 1 ? 9 : 3
                armorExp = 0xff
            }
            state.characters[charId].armor = armor
            state.characters[charId].armorLv = armorLv
            state.characters[charId].armorExp = armorExp
        },
        updateAcc: (state, action) => {
            const { accId, charId } = action.payload
            const acc = accId === -1 ? 0 : accId
            state.characters[charId].acc = acc
        },
        setAllLevel: (state, action) => {
            state.level = Math.max(
                MIN_LEVEL,
                Math.min(MAX_LEVEL, Number(action.payload))
            )
            for (let i = 0; i < state.characters.length; i++) {
                level_up(state.characters[i], state.level)
            }
        },
        setLevel: (state, action) => {
            const { charId, level } = action.payload
            const newLevel = Math.max(
                MIN_LEVEL,
                Math.min(MAX_LEVEL, Number(level))
            )
            state.characters[charId] = level_up(
                state.characters[charId],
                newLevel
            )
        },
        setSameLevelForAll: (state, action) => {
            state.sameLevelForAll = action.payload
        },
    },
})

export const {
    select,
    deSelect,
    updateWeapon,
    updateArmor,
    updateAcc,
    setAllLevel,
    setLevel,
    setSameLevelForAll,
} = charactersSlice.actions
export default charactersSlice.reducer
