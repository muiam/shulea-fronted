import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHeadersWithAuth, getPrivateUrl } from "../../app/ApiRequest";
import { setUnreadCount } from "../../features/Notifications/notificationSlice";
import { RootState } from "../../app/store";

export const useUnreadCount = () => {
  const dispatch = useDispatch();
  const unreadCount = useSelector(
    (state: RootState) => state.notifications.count
  );

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const response = await fetch(
          getPrivateUrl(`app/notifications/for/users/status/unread/count`),
          {
            method: "GET",
            headers: getHeadersWithAuth(),
          }
        );
        if (response.ok) {
          const data = await response.json();
          dispatch(setUnreadCount(data.count));
        } else {
          throw new Error("Failed to fetch unread count");
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };
    fetchUnread();
  }, [dispatch]);

  return unreadCount;
};
