import { configureStore } from '@reduxjs/toolkit';
import { activeBoardReducer } from './activeBoard/activeBoardSlice';
import { userReducer } from './user/userSlice';
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import { activeCardReducer } from './activeCard/activeCardSlice'
import { notificationsReducer } from './notifications/notificationsSlice'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'notifications']
}
const rootReducer = combineReducers({
    activeBoard: activeBoardReducer, // Đảm bảo tên reducer trùng với tên slice
    user: userReducer,
    activeCard: activeCardReducer,
    notifications: notificationsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Bỏ qua kiểm tra cho các action này
      },
    }),
});

