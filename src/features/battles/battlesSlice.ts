import { createSlice } from '@reduxjs/toolkit'
import { BattleData } from '../../data/DataInterface'

const battles: BattleData = require('../../data/battles.json')

const RED = 1
const BLUE = 2

interface BattleState {
    redOrBlue: number
    battleId: number
    battles: BattleData
}

const initialState: BattleState = {
    redOrBlue: RED,
    battleId: 1,
    battles: battles,
}

const battlesSlice = createSlice({
    name: 'battles',
    initialState,
    reducers: {
        red: (state) => {
            state.redOrBlue = RED
            state.battleId = 1
        },
        blue: (state) => {
            state.redOrBlue = BLUE
            state.battleId = 1
        },
        selectBattle: (state, action) => {
            state.battleId = action.payload
        },
    },
})

export const { red, blue, selectBattle } = battlesSlice.actions
export default battlesSlice.reducer
