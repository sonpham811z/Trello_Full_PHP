import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxios from '~/utils/authorizedAxios'
import { API_ROOT_DEV } from '~/utils/constants'

const initialState = {
    currentNotifications: null
}

export const fetchInvitationsAPI = createAsyncThunk(
    'notifications/fetchNotificationsAPI',
    async () => {
        const response = await authorizedAxios.get(`${API_ROOT_DEV}/api/invitations`)
        return response.data
    }
)

export const updateBoardInvitationAPI = createAsyncThunk(
    'notifications/updateBoardInvitationAPI',
    async ({ notificationId, status }) => {
        const response = await authorizedAxios.put(`${API_ROOT_DEV}/api/invitations/${notificationId}`, {status})
        return response.data    
    }
)

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearCurrentNotifications : (state) => {
            state.currentNotifications = null
        },

        updateCurrentNotifications : (state, action) => {
                
               const { id, status } = action.payload;
                const inv = state.currentNotifications.find(i => i.id === id);
                if (inv) inv.status = status;
        },

        addNotifications: (state, action) => {
            const newNotifications = action.payload

            const noti = newNotifications.invitation ? newNotifications.invitation : newNotifications
            state.currentNotifications.unshift(noti)

        }
    },

    extraReducers: (builder) => {

        builder.addCase(fetchInvitationsAPI.fulfilled, (state, action)=>{
            let newNotifications = action.payload
            state.currentNotifications = Array.isArray(newNotifications) ? newNotifications.reverse() : []
        })

        builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
            const newNotifications = action.payload
            
            const found = state.currentNotifications?.find(i => i.id === newNotifications.id)
            if (found) {
                found.boardInvitation = newNotifications.boardInvitation
            }
        })
    }
})


export const { clearCurrentNotifications, updateCurrentNotifications, addNotifications } = notificationsSlice.actions

export const selectCurrentNotifications = (state) => 
    state.notifications.currentNotifications 

    

export const notificationsReducer = notificationsSlice.reducer