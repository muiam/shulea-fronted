import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHeadersWithAuth, getPrivateUrl } from "../../app/ApiRequest";
import { setUnreadCount } from "../../features/Notifications/notificationSlice";
import { AppDispatch, RootState } from "../../app/store";

interface Message {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
}

export const useMessageState = () => {
  const [theMessage, setMessage] = useState<Message[]>([]);
  return { theMessage, setMessage };
};

export const useHandleRead = (
  theMessage: Message[],
  setMessage: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const dispatch = useDispatch<AppDispatch>();
  const unreadCount = useSelector(
    (state: RootState) => state.notifications.count
  );

  const handleRead = async (id: number) => {
    let update = await fetch(
      getPrivateUrl(`app/notifications/for/users/read/${id}`),
      {
        method: "PUT",
        headers: getHeadersWithAuth(),
      }
    );
    if (update.status === 200) {
      let count = unreadCount - 1;
      dispatch(setUnreadCount(count));
      const updatedMessages = theMessage.filter((item) => item.id !== id);
      setMessage(updatedMessages);
    }
  };

  return handleRead;
};
