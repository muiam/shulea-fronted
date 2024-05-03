import { Navigate } from "react-router-dom";
import MainNavbar from "./menus/MainNavbar";
import FinanceDashBoard from "./dashboards/FinanceDashboard";
import ParentDashboard from "./dashboards/ParentDashboard";
import HeadDashboard from "./dashboards/HeadDashboard";
import TeacherDashBoard from "./dashboards/TeacherDashBoard";

function HomePage() {
  const userDetails = localStorage.getItem("userDetails");
  const user = userDetails ? JSON.parse(userDetails) : null;

  // If user is null, redirect to the login page
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <MainNavbar />
      <div className="app-content-start">
        {user.type === "accountant" && <FinanceDashBoard />}
        {user.type === "parent" && <ParentDashboard />}
        {user.type === "headTeacher" && <HeadDashboard />}
        {user.type == "teacher" && <TeacherDashBoard />}
      </div>
    </>
  );
}

export default HomePage;
