import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentActiveCard: null,
    isShowingModal: false
}

export const activeCardSlice = createSlice({
    name: 'activeCard',
    initialState,

    reducers: {
        showingModal: (state) => {
            state.isShowingModal = true
        },

        clearCurrentActiveCard: (state) => {
            state.currentActiveCard = null, 
            state.isShowingModal = false
        },

        updateCurrentActiveCard: (state, action) => {
            const incoming = action.payload
            const oldCard = state.currentActiveCard

            if (!oldCard) {
                state.currentActiveCard = incoming
                return
            }

            state.currentActiveCard = {
                ...oldCard,
                ...incoming,
                checklists: incoming.checklists ?? oldCard.checklists,
                labels: incoming.labels ?? oldCard.labels,
                members: incoming.members ?? oldCard.members,
                comments: incoming.comments ?? oldCard.comments
            }
            }

    },

 
})

export const { clearCurrentActiveCard, updateCurrentActiveCard, showingModal} = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => state.activeCard.currentActiveCard
export const selectIsShowModal = (state) => state.activeCard.isShowingModal

export const activeCardReducer = activeCardSlice.reducer