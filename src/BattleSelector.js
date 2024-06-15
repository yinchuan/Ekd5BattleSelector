import React from 'react'

const BattleSelector = ({ data, redOrBlue, battleId, onChange }) => {
    const handleSelect = (event) => {
        onChange(event.target.value)
    }

    return (
        <div>
            <div>
                <label>关卡: </label>
                <select onChange={handleSelect} value={battleId}>
                    {Object.keys(data).map((key) => (
                        <option
                            key={key}
                            value={key}
                            style={{
                                display:
                                    (data[key].redOrBlue & redOrBlue) === 0 &&
                                    'none',
                            }}
                        >
                            {data[key].name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default BattleSelector
