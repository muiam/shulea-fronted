import React, { useEffect, useState } from "react";
import MainNavbar from "../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../app/ApiRequest";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { setUnreadCount } from "../../features/Notifications/notificationSlice";
import { useNavigate } from "react-router-dom";

const NotificationComponent = () => {
  const [theMessage, setMessage] = useState<Message[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const unreadCount = useSelector(
    (state: RootState) => state.notifications.count
  );
  const userDetails = localStorage.getItem("userDetails");
  const user = userDetails ? JSON.parse(userDetails) : null;
  useEffect(() => {
    fetchUnread();
  }, []);

  const fetchUnread = async () => {
    let response = await fetch(
      getPrivateUrl(`app/notifications/for/users/status/unread/count`),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );

    let data = await response.json();
    setMessage(data.unread);
  };

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

  interface Message {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
  }

  interface NotificationProps {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
  }

  const Notification: React.FC<NotificationProps> = ({
    is_read,
    id,
    title,
    message,
  }) => {
    const [showMessage, setShowMessage] = useState(false);

    const toggleMessage = () => {
      setShowMessage(!showMessage);
    };

    return (
      <div>
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {is_read ? (
            <p style={{ margin: "0", color: "#333" }} onClick={toggleMessage}>
              {title}
            </p>
          ) : (
            <p
              style={{ margin: "0", color: "#333", fontWeight: "bold" }}
              onClick={toggleMessage}
            >
              {title}
            </p>
          )}
          {showMessage && (
            <div
              style={{
                height: "fit-content",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              <p style={{ marginTop: "5px", color: "#666" }}>{message}</p>
              {/* Conditionally render the button */}
              <button
                style={{
                  marginTop: "20px",
                  display: "flex",
                  alignSelf: "flex-end",
                  height: "40px",
                  marginRight: "0",
                  width: "150px",
                  fontWeight: "bold",
                }}
                onClick={() => handleRead(id)}
              >
                Mark as read
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <MainNavbar />
      <div className="app-content-start">
        <div
          className="add-new-notification"
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            cursor: "pointer",
          }}
        >
          {user.type !== "parent" && (
            <i
              className="fa-solid fa-plus"
              style={{
                marginBottom: "50px",
                zIndex: 0,
                fontSize: "30px",
              }}
              onClick={() => navigate("/compose/notification")}
            ></i>
          )}
        </div>
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          {theMessage.map((item, index) => (
            <Notification
              key={index}
              id={item.id}
              title={item.title}
              message={item.message}
              is_read={item.is_read}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default NotificationComponent;
