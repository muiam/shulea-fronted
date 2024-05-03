import { useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { useParams } from "react-router-dom";

interface Report {
  id: number;
  level_name: string;
  teacher_name: string;
  subject_name: string;
  week_name: string;
  student_name: string;
  date: string;
  student_adm: number;
  academic_progress: string;
  behavior_effort: string;
  goals_achieved: string;
  improvement_areas: string;
  comments: string;
  next_week_goals: string;
}

function MyReportDetails() {
  const params = useParams();
  const [report, setReport] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    getReportData();
  }, []);

  const getReportData = async () => {
    try {
      setLoading(true); // Set loading to true when fetching data
      let response = await fetch(
        getPrivateUrl(
          `app/kid/my/progress/weekly/single/report/details/${params.id}`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      let data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is completed
    }
  };

  return (
    <>
      <MainNavbar />
      <div className="app-content-start">
        {loading ? ( // Conditional rendering of loader
          <div className="loader">Loading...</div>
        ) : (
          report.map((item, index) => (
            <div
              className="report-area"
              key={index}
              id="report-area"
              style={{
                display: "grid",
                height: "fit-content",
                width: "100%",
                gap: "1rem", // Optional gap between grid items
                marginTop: "10px",
                marginBottom: "20px",
              }}
            >
              <div style={{ height: "fit-content", width: "100%" }}>
                <h2
                  style={{ textDecoration: "underline", marginBottom: "5px" }}
                >
                  Learner academic progress
                </h2>
                <p>{item.academic_progress}</p>
              </div>
              <div style={{ height: "fit-content", width: "100%" }}>
                <h2
                  style={{ textDecoration: "underline", marginBottom: "5px" }}
                >
                  Learner behavior && effort
                </h2>
                <p>{item.behavior_effort}</p>
              </div>
              <div style={{ height: "fit-content", width: "100%" }}>
                <h2
                  style={{ textDecoration: "underline", marginBottom: "5px" }}
                >
                  Goals achieved so far
                </h2>
                <p>{item.goals_achieved}</p>
              </div>
              <div style={{ height: "fit-content", width: "100%" }}>
                <h2
                  style={{ textDecoration: "underline", marginBottom: "5px" }}
                >
                  Areas of improvement
                </h2>
                <p>{item.improvement_areas}</p>
              </div>
              <div style={{ height: "fit-content", width: "100%" }}>
                <h2
                  style={{ textDecoration: "underline", marginBottom: "5px" }}
                >
                  Teacher comments
                </h2>
                <p>{item.comments}</p>
              </div>
              <div
                style={{
                  height: "fit-content",
                  width: "100%",
                }}
              >
                <h2
                  style={{ textDecoration: "underline", marginBottom: "5px" }}
                >
                  Report summary
                </h2>
                <div className="" style={{ marginTop: "5%" }}>
                  <h4>
                    This report was compiled by {item.teacher_name} on{" "}
                    {item.date} valid for {item.week_name}
                  </h4>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MyReportDetails;
