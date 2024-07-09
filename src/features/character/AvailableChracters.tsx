import { useState } from 'react'
import { Tab, Tabs, Typography } from '@mui/material'

import { select } from './charactersSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

const AvailableChracters = () => {
    const dispatch = useAppDispatch()
    const selectedIds = useAppSelector((state) => state.characters.selectedIds)
    const characters = useAppSelector((state) => state.characters.characters)
    const belongs = useAppSelector((state) => state.characters.belongs)

    const [activeTab, setActiveTab] = useState(0)

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

            {[...belongs.keys()].map((i) => {
                return (
                    <div
                        role="tabpanel"
                        // index={i}
                        hidden={activeTab !== i}
                        id={`tab-${belongs[i]}`}
                    >
                        <ul style={{ columnCount: 4 }}>
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
            })}
        </div>
    )
}

export default AvailableChracters
