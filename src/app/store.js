import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

import battleReducer from '../features/battles/battlesSlice'
import saveIdReducer from '../features/saveId/saveIdSlice'
import characterReducer from '../features/character/charactersSlice'

const persistConnfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
}

const persistedReducer = persistReducer(
    persistConnfig,
    combineReducers({
        battles: battleReducer,
        saveId: saveIdReducer,
        characters: characterReducer,
    })
)

const store = configureStore({
    reducer: persistedReducer,
})

export default store
