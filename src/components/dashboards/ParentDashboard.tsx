import { useDispatch } from "react-redux";
import { UserWelcome } from "../menus/CustomMenu";
import { getHeadersWithAuth, getPrivateUrl } from "../../app/ApiRequest";
import { useEffect, useState } from "react";
import LearnerAcademicChart from "../forms/parents/LearnerAcademicChart";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";

interface Student {
  id: number;
  name: string;
  admission_number: number;
}
function ParentDashboard() {
  const userDetails = localStorage.getItem("userDetails");
  const user = userDetails ? JSON.parse(userDetails) : null;
  const [yearData, setYearData] = useState([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [studentNumber, setLearners] = useState<number>(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    academicData();
  }, [selectedStudentId]);

  useEffect(() => {
    const getSummary = async () => {
      let response = await fetch(getPrivateUrl(`app/kid/my/data/summary`), {
        method: "GET",
        headers: getHeadersWithAuth(),
      });
      if (response.status == 200) {
        let data = await response.json();
        setLearners(data.student_number);
        setWalletBalance(data.total_wallet_balance);
      }
    };
    getSummary();
  }, []);

  const academicData = async () => {
    if (selectedStudentId !== null && selectedStudentId !== 0) {
      let response = await fetch(
        getPrivateUrl(
          `exam-results/academic/year/recent/analysis/${selectedStudentId}`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setYearData(data);
      }
    } else {
      let response = await fetch(
        getPrivateUrl(
          `exam-results/academic/year/recent/analysis/default/student`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setYearData(data);
      }
    }
  };
  useEffect(() => {
    const getStudents = async () => {
      let response = await fetch(getPrivateUrl(`actions/my/student/`), {
        method: "GET",
        headers: getHeadersWithAuth(),
      });
      if (response.status === 200) {
        let data = await response.json();
        setStudents(data);
      }
    };
    getStudents();
  }, []);
  const progress = () => {
    navigate(`/my/kid/progress`);
  };
  const fees = () => {
    navigate(`/tuition/fee/`);
  };
  const reports = () => {
    navigate(`/my/kid/reports`);
  };
  function hanleLogout() {
    dispatch(logout());
    navigate("/");
  }
  return (
    <>
      <div className="div-right">
        <UserWelcome
          name={user.firstName + " " + user.lastName || "New User"}
        />
      </div>
      <div className="default-dashboard-stats-container">
        <div
          className="main-dashboard-container"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            className="select-year-here"
            style={{
              alignSelf: "flex-end",
            }}
          >
            <select
              style={{
                background: "aqua",
                height: "50px",
                marginRight: "10px",
                width: "200px",
                borderRadius: "8px",
              }}
              disabled={students.length == 1}
              name="students"
              className="change-grade"
              value={selectedStudentId || ""}
              onChange={(e) => {
                setSelectedStudentId(Number(e.target.value));
              }}
            >
              <option value={""} disabled>
                student
              </option>
              {students.map((student) => (
                <option value={student.id} key={student.id}>
                  {student.admission_number} - {student.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <LearnerAcademicChart yearData={yearData} />
          </div>
        </div>
        <div
          className="minor-dashboard-container"
          style={{
            display: "grid",
            gridAutoColumns: "repeat(2 ,1fr)",
          }}
        >
          <div
            className=""
            style={{
              background: "aqua",
              borderRadius: "8px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {studentNumber} KID (S) STUDYING
          </div>
          <div
            className=""
            style={{
              background: "aqua",
              borderRadius: "8px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            KES {walletBalance} <br></br> TOTAL WALLET BALANCES
          </div>
          <div
            className=""
            style={{
              border: "1px solid aqua",
              borderRadius: "8px",
              marginBottom: "10px",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)", // Two columns
              gap: "5px", // Gap between buttons
              padding: "10px", // Padding inside the div
            }}
          >
            <button
              onClick={progress}
              style={{ background: "aqua", width: "100%" }}
            >
              PROGRESS
            </button>
            <button
              onClick={fees}
              style={{ background: "aqua", width: "100%" }}
            >
              FEES
            </button>
            <button
              onClick={reports}
              style={{ background: "aqua", width: "100%" }}
            >
              REPORTS
            </button>
            <button
              onClick={hanleLogout}
              style={{ background: "aqua", width: "100%" }}
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ParentDashboard;
