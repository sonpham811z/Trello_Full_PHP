import authorizedAxios from "~/utils/authorizedAxios";
import { API_ROOT, API_ROOT_DEV } from "~/utils/constants";
import { toast } from "react-toastify";

// BOARD
// ở đây không nhất thiết phải catch lỗi gì axios hỗ trợ Interceptors để xử lí lỗi tập trung ở 1 chỗ thoi (cái này trong phần nâng cao)
// đã move vào REDUX

// export const fetchBoardAPI = async(boardId) => {
//     const response = await axios.get(`${API_ROOT}/server/boards/${boardId}`) // giao thức get vì bên phần be trong file route_v1 define là Router.route('/:id').get()

//     return response.data // trong axios nó sẽ trả về 1 object, và cái mình cần là 1 bản ghi trong monggodb sẽ là 1 property tên là data nên sẽ là response.data
// }

// API UPDATE COLUMN ORDER IDS
export const updateBoardAPI = async(boardId, updateData) => {
    const response = await authorizedAxios.put(`${API_ROOT_DEV}/api/boards/${boardId}`, updateData) // giao thức put vì bên phần be trong file route_v1 define là Router.route('/:id').put()

    return response.data // trong axios nó sẽ trả về 1 object, và cái mình cần là 1 bản ghi trong monggodb sẽ là 1 property tên là data nên sẽ là response.data
}

// API DELETE COLUMN
export const deleteColumnAPI = async(columnId,boardId) => {
    const response = await authorizedAxios.delete(`${API_ROOT_DEV}/api/columns/${columnId}`, { data: { boardId: boardId } });// giao thức delete vì bên phần be trong file route_v1 define là Router.route('/:id').delete()
    return response.data
}

export const moveCardsToDifferenceColumns = async( updateData) => {
    const response = await authorizedAxios.post(`${API_ROOT_DEV}/api/columns/move-between-columns`, updateData) 
    return response.data 
}

// API TẠO COLUMN
export const createNewColumnAPI = async(columnData) => {
    const response  = await authorizedAxios.post(`${API_ROOT_DEV}/api/columns`, columnData) // giao thức post vì bên phần be trong file route_v1 define là Router.route('/').post()

    return response.data
}
// API update card khi kéo thả trong 1 column
export const updateColumnAPI = async(columnId, updateData) => {
    const response = await authorizedAxios.put(`${API_ROOT_DEV}/api/columns/${columnId}`, updateData) // giao thức get vì bên phần be trong file route_v1 define là Router.route('/:id').get()

    return response.data // trong axios nó sẽ trả về 1 object, và cái mình cần là 1 bản ghi trong monggodb sẽ là 1 property tên là data nên sẽ là response.data
}

// API TẠO CARD
export const createNewCardAPI = async(cardData) => {
    const response = await authorizedAxios.post(`${API_ROOT_DEV}/api/cards`, cardData) // giao thức post vì bên phần be trong file route_v1 define là Router.route('/').post()
    return response.data
}

// API tạo account

export const registerAccountAPI = async(data) => {
    const response = await authorizedAxios.post(`${API_ROOT}/server/users/register`, data) //
    toast.success('Account created successfully, please check your email to verify your account')
    return response.data
}

// API verify account

export const employerVerifyAccountAPI = async(data) => {
    const response = await authorizedAxios.put(`${API_ROOT_DEV}/api/verify`, data) // giao thức post
    toast.success('Account verified successfully, Login to use Trello !')
    return response.data
}



//API get list boards 
export const getListBoardsAPI = async(searchPath) => {
    const response = await authorizedAxios.get(`${API_ROOT_DEV}/api/boards${searchPath}`) 
    return response.data
}

// API create a board
export const createBoardAPI = async(boardData) => {
    const response = await authorizedAxios.post(`${API_ROOT_DEV}/api/boards`, boardData)
    return response.data
}

export const updateCardDetailAPI = async(cardId,data) => {
    const response = await authorizedAxios.post(`${API_ROOT_DEV}/api/cards/${cardId}`, data)
    return response.data
}

export const updateCardCommentlAPI = async(cardId,data) => {
    const response = await authorizedAxios.post(`${API_ROOT_DEV}/api/cards/${cardId}/comment`, data)
    return response.data
}

export const updateCardMemberAPI = async(cardId,data) => {
    const response = await authorizedAxios.post(`${API_ROOT_DEV}/api/cards/${cardId}/member`, data)
    return response.data
}

export const inviteUserToBoardAPI = async(data) => {
    const response = await authorizedAxios.post(`${API_ROOT_DEV}/api/invitations/board`, data)
    toast.success('Invite success', {
        position: 'bottom-right'
    })
    return response.data
}

export const createLabel = async(name, color, cardData) => {
    const response = await authorizedAxios.post(`${API_ROOT_DEV}/api/cards/${cardData.id}/labels`, {
        name,
        color
    })
    return response.data
}

export const removeLabel = async(labelId) => {
    const response = await authorizedAxios.delete(`${API_ROOT_DEV}/api/card-labels/${labelId}`)
    return response.data
}

export const createChecklistAPI = async(cardId, title) => {
  const res = await authorizedAxios.post(`${API_ROOT_DEV}/api/cards/${cardId}/checklists`, { title });
  return res.data;
}

export const createChecklistItemAPI = async(checklistId, text) => {
  const res = await authorizedAxios.post(`${API_ROOT_DEV}/api/checklists/${checklistId}/items`, { text });
  return res.data;
}

export const toggleChecklistItemAPI = async(itemId, is_done) => {
  const res = await authorizedAxios.patch(`${API_ROOT_DEV}/api/checklist-items/${itemId}`, { is_done });
  return res.data;
}

export const deleteChecklistAPI = async(checklistId) => {
  const res = await authorizedAxios.delete(`${API_ROOT_DEV}/api/checklists/${checklistId}`);
  return res.data;
}

export const deleteChecklistItemAPI = async(id) => {
  const res = await authorizedAxios.delete(`/checklist-items/${id}`);
  return res.data;
}

