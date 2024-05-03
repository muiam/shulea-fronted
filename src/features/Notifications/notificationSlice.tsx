import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface Notification {
  id: number;
  title: string;
  time: string;
  message: string;
  is_read: boolean;
  recipient: number;
}

// Define the structure of the notifications state
interface NotificationsState {
  count: number;
  notifications: Notification[];
}
const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { count: 0, notifications: [] } as NotificationsState,
  reducers: {
    setUnreadCount: (state, action) => {
      state.count = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    markAsRead: (state, action) => {
      const index = state.notifications.findIndex(
        (n) => n.id === action.payload
      );
      if (index !== -1) {
        state.notifications[index].is_read = true;
      }
    },
  },
});

export const { setUnreadCount, addNotification, markAsRead } =
  notificationsSlice.actions;

// In your notifications slice file
export const selectAllNotifications = (state: RootState) =>
  state.notifications.notifications;

export default notificationsSlice.reducer;
