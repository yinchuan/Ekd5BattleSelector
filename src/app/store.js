import { configureStore } from '@reduxjs/toolkit'
import battleReducer from '../features/battles/battlesSlice'
import saveIdReducer from '../features/saveId/saveIdSlice'
import characterReducer from '../features/character/charactersSlice'

const store = configureStore({
    reducer: {
        battles: battleReducer,
        saveId: saveIdReducer,
        characters: characterReducer,
    },
})

export default store
