import { createSlice } from '@reduxjs/toolkit'

const saveIdSlice = createSlice({
    name: 'saveId',
    initialState: {
        id: 1,
    },
    reducers: {
        setSaveId: (state, action) => {
            state.id = parseInt(action.payload)
        },
    },
})

export const { setSaveId } = saveIdSlice.actions
export default saveIdSlice.reducer
