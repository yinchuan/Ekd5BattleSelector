import { useSelector, useDispatch } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { Tab, Tabs, Typography } from '@mui/material'

import { select } from './charactersSlice'

const AvailableChracters = () => {
    const dispatch = useDispatch()
    const selectedIds = useSelector((state) => state.characters.selectedIds)
    const characters = useSelector((state) => state.characters.characters)
    const [activeTab, setActiveTab] = useState(0)
    const [belongs, setBelongs] = useState([])
    useEffect(() => {
        setBelongs([...new Set(characters.map((item) => item.belongTo))])
    }, [characters])
    return (
        <div>
            <Typography variant="h5">Available Characters</Typography>
            <Tabs
                value={activeTab}
                onChange={(event, newValue) => setActiveTab(newValue)}
            >
                {belongs.map((belong) => (
                    <Tab label={`${belong}`} id={`tab-${belong}`} />
                ))}
            </Tabs>
            {(() => {
                const temp = []
                for (let i = 0; i < belongs.length; i++) {
                    temp.push(
                        <div
                            role="tabpanel"
                            index={i}
                            hidden={activeTab !== i}
                            id={`tab-${belongs[i]}`}
                        >
                            <ul>
                                {characters
                                    .filter(
                                        (item) =>
                                            !selectedIds.includes(item.id) &&
                                            item.belongTo === belongs[i]
                                    )
                                    .map((item) => (
                                        <li
                                            key={item.id}
                                            onClick={() =>
                                                dispatch(select(item.id))
                                            }
                                        >
                                            {item.name}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )
                }
                return temp
            })()}
        </div>
    )
}

export default AvailableChracters
