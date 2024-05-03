import { configureStore } from "@reduxjs/toolkit";
import auth from "../features/authSlice";
import notificationsReducer from "../features/Notifications/notificationSlice";

const store = configureStore({
  reducer: {
    auth: auth,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
