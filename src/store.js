import { configureStore } from '@reduxjs/toolkit'
import battleReducer from './battlesSlice'
import saveIdReducer from './saveIdSlice'

const store = configureStore({
    reducer: {
        battles: battleReducer,
        saveId: saveIdReducer,
    },
})

export default store
