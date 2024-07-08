import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>
)
