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

const rootReducer = combineReducers({
    battles: battleReducer,
    saveId: saveIdReducer,
    characters: characterReducer,
})

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
    persistConnfig,
    rootReducer
)

const store = configureStore({
    reducer: persistedReducer,
})

export default store

export type AppStore = typeof store
export type RootState = ReturnType<typeof rootReducer>
// export type AppDispatch = AppStore['dispatch']
export type AppDispatch = (typeof store)['dispatch']
