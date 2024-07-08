import { configureStore } from '@reduxjs/toolkit'
import battleReducer from './battlesSlice'

const store = configureStore({
    reducer: {
        battles: battleReducer,
    },
})

export default store
