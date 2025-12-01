import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {  API_ROOT_DEV } from '~/utils/constants'
import authorizedAxios from '~/utils/authorizedAxios'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceHolderCard } from '~/utils/formatter'

const initialState = {
  currentActiveBoard: null
}


export const fetchBoardAPI = createAsyncThunk(
    'activeBoard/fetchBoardAPI', 
    async (boardId) => {
        const response = await authorizedAxios.get(`${API_ROOT_DEV}/api/boards/${boardId}`)
        
        return response.data
    }
)

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      const fullBoard = action.payload // action.payload là 1 chuẩn đặt tên của redux toolkit
    
      state.currentActiveBoard = fullBoard
    },

    clearBoardData: (state)=>{
      state.currentActiveBoard = null
    },

    updateCardInBoard: (state, action) => { 
      const Updatecard = action.payload
      console.log(Updatecard)

      const column = state.currentActiveBoard.columns.find(i => i.id === Updatecard.column_id)
      if(column)
      {
        const card = column.cards.find(c => c.id === Updatecard.id)
        if (card) {
          Object.keys(Updatecard).forEach(key => {
            // nếu backend không trả labels thì giữ lại labels cũ
            if (key === 'labels' && !Updatecard.labels) return

            card[key] = Updatecard[key]
          })
        }

      }

    }
  },

  // extrareducer xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardAPI.fulfilled, (state,action) => {
        let fullBoard = action.payload // action.payload ở đây là data trả về từ API là cái response.value
        fullBoard.allUsers = [...(fullBoard.members || []), fullBoard.owner]

        // Gộp 2 mảng owner và member
        // fullBoard.allUsers = fullBoard.owners.concat(fullBoard.members)
        // Xử lí dữ liệu
        fullBoard.columns = mapOrder(fullBoard.columns, fullBoard.column_order_ids, 'id')
        
        fullBoard.columns.forEach(column => {
            if(isEmpty(column.cards))
            {
                column.cards = [generatePlaceHolderCard(column)]
                column.card_order_ids = [generatePlaceHolderCard(column).id]
            }
            else
            {
                // Sắp xếp lại mảng Card theo cardOrderIds rồi truyền xuống cac tầng khác
                column.cards = mapOrder(column.cards, column.card_order_ids, 'id')
            }
        })
                
     //Update lại dử liệu của current activeboard
        state.currentActiveBoard = fullBoard // tương tạc như setState(board) trong _id.jsx nhưng cach1 code khác
    })
}
})


// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó đề cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Đề ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.

export const { updateCurrentActiveBoard, updateCardInBoard, clearBoardData} = activeBoardSlice.actions


// Selectors: Là nơi dùng để component lấy dữ liệu từ store bằng hook useSelector(), nhưng không thể thay đổi dữ liệu trong store
// tác dụng ngược lại với actions, actions dùng update date trong redux, còn selectors dùng để lấy dữ liệu ra
export const selectCurrentActiveBoard = (state) => state.activeBoard.currentActiveBoard; // Phù hợp với tên slice mới


// không export cả activeBoardSlice mà chỉ export ra phần reducer là một phần trong slice
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer