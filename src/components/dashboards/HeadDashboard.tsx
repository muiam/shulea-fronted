import { useDispatch } from "react-redux";
import { UserWelcome } from "../menus/CustomMenu";
import { AppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { getHeadersWithAuth, getPrivateUrl } from "../../app/ApiRequest";
import { useEffect, useState } from "react";
function HeadDashboard() {
  const userDetails = localStorage.getItem("userDetails");
  const user = userDetails ? JSON.parse(userDetails) : null;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [student, setStudents] = useState<number>(0);
  const [parents, setParents] = useState<number>(0);
  const [teachers, setTeachers] = useState<number>(0);

  useEffect(() => {
    users();
  }, []);

  const users = async () => {
    let response = await fetch(
      getPrivateUrl(`actions/stats/all/members/count`),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 200) {
      let data = await response.json();
      setParents(data.parents);
      setTeachers(data.teachers);
      setStudents(data.students);
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
        <div className="head-dashboard-container">
          Active teachers : {teachers}
        </div>
        <div className="head-dashboard-container">
          Active parents : {parents}
        </div>
        <div className="head-dashboard-container">
          Active students : {student}
        </div>
      </div>
      <div className="quick-links">
        <p>Quick Navigation</p>
        <div className="quick-links-container">
          <a href="/teachers" className="quick-link">
            teachers
          </a>
          <a href="/parents" className="quick-link">
            parents
          </a>
          <a href="/students" className="quick-link">
            students
          </a>
          <a href="/" className="quick-link">
            accountants
          </a>
          <a href="/subjects" className="quick-link">
            our subjects
          </a>
          <a href="/weekly-reports" className="quick-link">
            reports
          </a>
          <a href="/levels" className="quick-link">
            grades/levels
          </a>
          <a href="/" className="quick-link">
            Academic years
          </a>
          <a href="/" className="quick-link">
            terms
          </a>
          <a href="/" className="quick-link">
            exams
          </a>
          <a href="/all/my/updates" className="quick-link">
            updates
          </a>
          <a href="/change/password" className="quick-link">
            reset password
          </a>
          <a
            href="/"
            className="quick-link"
            onClick={() => dispatch(logout(), navigate("/"))}
          >
            logout
          </a>
        </div>
      </div>
    </>
  );
}

export default HeadDashboard;
