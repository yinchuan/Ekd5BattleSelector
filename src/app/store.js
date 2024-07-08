import { configureStore } from '@reduxjs/toolkit'
import battleReducer from '../features/battles/battlesSlice'
import saveIdReducer from '../features/saveId/saveIdSlice'

const store = configureStore({
    reducer: {
        battles: battleReducer,
        saveId: saveIdReducer,
    },
})

export default store
