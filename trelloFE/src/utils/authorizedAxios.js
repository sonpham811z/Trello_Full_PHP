import axios from 'axios'
import { toast } from 'react-toastify'
import { logOutAPI } from '~/redux/user/userSlice'
import { interceptorLoadingElements } from '~/utils/formatter'

const authorizedAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
})

// Không dùng cookie mode trong Sanctum Token mode:
authorizedAxios.defaults.withCredentials = false

authorizedAxios.interceptors.request.use((config) => {
    interceptorLoadingElements(true)

    // Lấy token từ Redux Persist/LocalStorage
    const persistedRoot = localStorage.getItem('persist:root')
    if (persistedRoot) {
        const parsed = JSON.parse(persistedRoot)
        const userState = JSON.parse(parsed.user || '{}')
        const token = userState.currentUser?.token

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
    }

    config.headers['Accept'] = 'application/json'
    return config
}, (error) => {
    return Promise.reject(error)
})

authorizedAxios.interceptors.response.use(
    (response) => {
        interceptorLoadingElements(false)
        return response
    },
    async(error) => {
        interceptorLoadingElements(false)

        // Token sai hoặc hết hạn → logout
        if (error.response?.status === 401) {
            store.dispatch(logOutAPI())
        }

        let errorMessage = error.response?.data?.message || error.message

        toast.error(errorMessage, {
            position: "bottom-right",
            theme: "colored"
        })

        return Promise.reject(error)
    }
)

let store

export const injectStore = mainStore => { store = mainStore }
export default authorizedAxios
