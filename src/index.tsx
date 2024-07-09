import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import store from './app/store'

const root = document.getElementById('root')
root &&
    createRoot(root).render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistStore(store)}>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </PersistGate>
        </Provider>
    )
