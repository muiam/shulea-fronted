import { useDispatch } from "react-redux";
import { UserWelcome } from "../menus/CustomMenu";
import { AppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { getHeadersWithAuth, getPrivateUrl } from "../../app/ApiRequest";
import { useEffect, useState } from "react";
function TeacherDashBoard() {
  const userDetails = localStorage.getItem("userDetails");
  const user = userDetails ? JSON.parse(userDetails) : null;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<number>(0);
  const [reports, setReports] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    usersData();
  }, []);

  const usersData = async () => {
    let response = await fetch(
      getPrivateUrl(`actions/stats/all/teacher/items`),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 200) {
      let data = await response.json();
      setSubjects(data.subjects);
      setReports(data.reports);
      setTotal(data.total_earned);
    }
  };
  return (
    <>
      <div className="div-right">
        <UserWelcome
          name={user.firstName + " " + user.lastName || "New User"}
        />
      </div>
      <div className="teacher-dashboard-flex" id="teacher-dashboard-flex">
        <div className="head-dashboard-container">My subjects : {subjects}</div>
        <div className="head-dashboard-container">All reports : {reports}</div>
        <div className="head-dashboard-container">
          All earnings : KES {total}
        </div>
      </div>
      <div className="quick-links">
        <h3>Quick Navigation</h3>
        <div className="quick-links-container">
          <a href="/my-subjects" className="quick-link">
            Enter marks
          </a>
          <a href="/year-exam" className="quick-link">
            View Ranks
          </a>
          <a href="/students-progress" className="quick-link">
            Track progress
          </a>
          <a href="/my-reports" className="quick-link">
            Reports
          </a>
          <a href="/my-payslips" className="quick-link">
            Payslips
          </a>
          <a href="/all/my/updates" className="quick-link">
            Updates
          </a>
          <a href="/change/password" className="quick-link">
            Reset password
          </a>
          <a
            href="/"
            className="quick-link"
            onClick={() => dispatch(logout(), navigate("/"))}
          >
            Logout
          </a>
        </div>
      </div>
    </>
  );
}

export default TeacherDashBoard;
