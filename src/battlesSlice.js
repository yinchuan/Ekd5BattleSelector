import { createSlice } from '@reduxjs/toolkit'

const RED = 1
const BLUE = 2

const battlesSlice = createSlice({
    name: 'battles',
    initialState: {
        redOrBlue: RED,
    },
    reducers: {
        red: (state) => {
            state.redOrBlue = RED
        },
        blue: (state) => {
            state.redOrBlue = BLUE
        },
    },
})

export const { red, blue } = battlesSlice.actions
export default battlesSlice.reducer
