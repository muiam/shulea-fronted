import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  TeacherMenu,
  AccountantMenu,
  HeadTeacherMenu,
  ParentMenu,
} from "./CustomMenu";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { login, logout } from "../../features/authSlice";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function MainNavbar() {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const myToken = localStorage.getItem("access");
    if (myToken) {
      const decodedToken = jwtDecode<JwtPayload>(myToken || "");
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        // Token is expired, dispatch logout action
        dispatch(logout());
      } else {
        // Token is valid, check if user data exists in localStorage
        const userDetails = localStorage.getItem("userDetails");
        if (userDetails) {
          // Rehydrate Redux store with user details
          const parsedUserDetails = JSON.parse(userDetails);
          dispatch(login(parsedUserDetails));
        }
      }
    } else {
      // No token found, dispatch logout action
      dispatch(logout());
    }
  }, [dispatch]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          />
        </Helmet>
      </HelmetProvider>

      {userData.type === "teacher" ? (
        <TeacherMenu />
      ) : userData.type === "headTeacher" ? (
        <HeadTeacherMenu />
      ) : userData.type === "accountant" ? (
        <AccountantMenu />
      ) : userData.type === "parent" ? (
        <ParentMenu />
      ) : null}
    </>
  );
}
