import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_ROOT, API_ROOT_DEV } from '~/utils/constants'
import authorizedAxios from '~/utils/authorizedAxios'
import { toast } from 'react-toastify'


// khởi tạo giá trị của 1 slice trong redux (slice là 1 phần của store, 1 phần của board)
const initialState = {
  currentUser: null
}

//các hành động call API bất đồng bộ sẽ sử dụng createAsyncThunk kết hợp với extraReducers (web redux toolkit)

export const loginUserAPI = createAsyncThunk(
    'user/loginUserAPI', // cách đặt tên asyncthunk là tên slice/tên function
    async (data) => {
        const response = await authorizedAxios.post(`${API_ROOT_DEV}/api/login`, data) 
        
        return response.data
    }
)

export const logOutAPI = createAsyncThunk(
  'user/logOutAPI',
  async (toastOfTokenExpired = false) => {
    const response = await authorizedAxios.delete(`${API_ROOT_DEV}/api/logout`)
    if(!toastOfTokenExpired)
      toast.success('Logout success')
    return response.data
  } 
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizedAxios.post(`${API_ROOT_DEV}/api/user/update`, data)
    return response.data
  } 
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
   
  },

  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state,action) => {
        state.currentUser = action.payload 
    })

    builder.addCase(logOutAPI.fulfilled, (state) => {
      state.currentUser = null;
    })

    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        user: {
          ...state.currentUser.user,
          ...action.payload
        }
      }
    })

}
})



export const selectCurrentUser = (state) => state.user.currentUser; // Phù hợp với tên slice mới

export const userReducer = userSlice.reducer