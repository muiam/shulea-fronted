import { useEffect, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { useNavigate } from "react-router-dom";

interface Level {
  name: string;
  id: number;
  stream?: string;
}
interface Week {
  id: number;
  name: string;
}

interface Report {
  id: number;
  level_name: string;
  teacher_name: string;
  subject_name: string;
  week_name: string;
  student_name: string;
  date: string;
  student_adm: number;
}
function AllReports() {
  const [grade, setGrade] = useState<Level[]>([]);
  const [week, setWeek] = useState<Week[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number>(0);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [report, setReport] = useState<Report[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getGrade();
    getWeek();
  }, []);

  const getGrade = async () => {
    let response = await fetch(getPrivateUrl("actions/levels"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    if (response.status == 200) {
      let data = await response.json();
      setGrade(data);
    }
  };

  const handleWeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWeek = Number(e.target.value);
    setSelectedWeek(selectedWeek);
  };
  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGrade = Number(e.target.value);
    setSelectedGrade(selectedGrade);
  };

  const getWeek = async () => {
    let response = await fetch(getPrivateUrl("app/weeks/all-weeks"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    if (response.status == 200) {
      let data = await response.json();
      setWeek(data);
    }
  };

  useEffect(() => {
    getReport();
  }, [selectedGrade, selectedWeek]);
  const getReport = async () => {
    if (selectedGrade && selectedWeek) {
      let response = await fetch(
        getPrivateUrl(
          `app/student/progress/weekly/reports/${selectedGrade}/${selectedWeek}`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setReport(data);
      }
    } else if (selectedGrade) {
      let response = await fetch(
        getPrivateUrl(
          `app/student/progress/weekly/reports/level/${selectedGrade}/`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setReport(data);
      }
    } else if (selectedWeek) {
      let response = await fetch(
        getPrivateUrl(
          `app/student/progress/weekly/reports/week/${selectedWeek}/`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setReport(data);
      }
    } else {
      let response = await fetch(
        getPrivateUrl(`app/student/progress/weekly/reports`),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setReport(data);
      }
    }
  };

  const handleReportData = (id: number) => {
    navigate(`/report/kid/progress/${id}/`);
  };

  const weeks = () => {
    navigate(`/report/weeks/`);
  };

  return (
    <>
      <MainNavbar />
      <div className="app-content-start">
        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "10px",
          }}
        >
          <div
            className=""
            style={{
              width: "300px",
              height: "40px",
              float: "right",
              display: "flex",
              marginTop: "10px",
              marginBottom: "10px",
              alignSelf: "flex-end",
            }}
          >
            <select
              onChange={handleGradeChange}
              value={selectedGrade || ""}
              style={{
                background: "aqua",
                marginRight: "10px",
                width: "100px",
              }}
            >
              <option>grade</option>
              {grade.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.stream ? item.name + item.stream : item.name}
                </option>
              ))}
            </select>

            <select
              onChange={handleWeeChange}
              value={selectedWeek || ""}
              style={{
                background: "aqua",
                width: "100px",
                marginRight: "10px",
              }}
            >
              <option>week</option>
              {week.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <button
              onClick={weeks}
              style={{
                width: "150px",
                padding: "15px",
                height: "40px",
                background: "aqua",
                margin: "0",
              }}
            >
              week
            </button>
          </div>
          <table className="default-table">
            <tbody>
              <tr>
                <th>#</th>
                <th>Nemis/Adm number</th>
                <th>student</th>
                <th>grade</th>
                <th>subject</th>
                <th>week</th>
                <th>teacher</th>
                <th>Date</th>
                <th>Report</th>
              </tr>
              {report.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.student_adm}</td>
                  <td>{item.student_name}</td>
                  <td>{item.level_name}</td>
                  <td>{item.subject_name}</td>
                  <td>{item.week_name}</td>
                  <td>{item.teacher_name}</td>
                  <td>{item.date}</td>
                  <td>
                    <button
                      onClick={() => handleReportData(item.id)}
                      style={{
                        background: "aqua",
                        padding: "15px",
                        width: "100px",
                      }}
                    >
                      view
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AllReports;
