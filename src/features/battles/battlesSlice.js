import { createSlice } from '@reduxjs/toolkit'
import battles from '../../data/battles.json'

const RED = 1
const BLUE = 2

const battlesSlice = createSlice({
    name: 'battles',
    initialState: {
        redOrBlue: RED,
        battleId: 2,
        battles: battles,
    },
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
