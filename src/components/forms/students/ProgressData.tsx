import { useEffect, useRef, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { useLocation } from "react-router-dom";
import ResultsChart from "./ResultsChart";
import { ToastContainer, toast } from "react-toastify";
import ReactToPrint from "react-to-print";

interface Level {
  stream?: string;
  id: number;
  name: string;
}

interface Student {
  id: number;
  name: string;
  admission_number: number;
}

interface ExamResult {
  id: number;
  subject_name: string;
  score: number;
  grade: string;
  percentage_change: number | null;
}
export interface ExamWiseTotals {
  [key: string]: number; // exam name to total marks mapping
}

function ProgressData() {
  const location = useLocation();
  const { year, term, exam } = location.state || {};
  const [levels, setLevels] = useState<Level[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [schoolName, setSchoolName] = useState<string>("");
  const [examName, setExamName] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [gradeLevel, setGradeLevel] = useState<string>("");
  const [previousTotal, setPreviousTotal] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const [examWiseTotals, setExamWiseTotals] = useState<ExamWiseTotals>({});
  const componentRef = useRef(null);
  useEffect(() => {
    fetch(getPrivateUrl("actions/levels"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch levels");
        }
        return response.json();
      })
      .then((data) => setLevels(data))
      .catch((error) => console.error("Error fetching levels:", error));
  }, []);

  useEffect(() => {
    const getStudents = async () => {
      if (selectedLevelId !== null) {
        let response = await fetch(
          getPrivateUrl(`students/level/${selectedLevelId}`),
          {
            method: "GET",
            headers: getHeadersWithAuth(),
          }
        );
        if (response.status === 200) {
          let data = await response.json();
          setStudents(data);
        }
      }
    };
    getStudents();
  }, [selectedLevelId]);

  useEffect(() => {
    const fetchStudentPerformance = async () => {
      if (
        selectedLevelId &&
        selectedStudentId &&
        year &&
        term &&
        exam !== null
      ) {
        let performance = await fetch(
          getPrivateUrl(
            `exam-results/compare/${year}/${term}/${exam}/${selectedLevelId}/${selectedStudentId}`
          ),
          {
            method: "GET",
            headers: getHeadersWithAuth(),
          }
        );
        if (performance.status == 200) {
          toast.success("fetch successful for this student");
          let data = await performance.json();
          setExamResults(data.exam_results || []);
          setSchoolName(data.exam_results[0].school_name);
          setStudentName(data.exam_results[0].student_name);
          setGradeLevel(data.exam_results[0].level_name);
          setPreviousTotal(data.previous_total_marks);
          setPercentageChange(data.percentage_change);
          setExamName(data.exam_results[0].exam_name);
          setExamWiseTotals(data.exam_wise_totals);
        } else {
          toast.error(
            "there was an error causing this failure. Contact your school"
          );
        }
      }
    };

    fetchStudentPerformance();
  }, [selectedLevelId, selectedStudentId, year, term, exam]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = parseInt(e.target.value, 10);
    setSelectedLevelId(levelId);
  };
  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div className="add-start-new">
          <div className="grade-toggle" id="toggle-grade-for-results-zone">
            <label htmlFor="grade">Change grade</label>
            <select
              name="grade"
              className="change-grade"
              onChange={handleLevelChange}
              value={selectedLevelId || ""}
            >
              <option value="" disabled>
                Select level
              </option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.stream
                    ? `Grade ${level.name} ${level.stream}`
                    : `Grade ${level.name}`}
                </option>
              ))}
            </select>
            <label htmlFor="students">student</label>
            <select
              name="students"
              className="change-grade"
              value={selectedStudentId || ""}
              onChange={(e) => {
                setSelectedStudentId(Number(e.target.value));
              }}
            >
              <option value="" disabled>
                select student
              </option>
              {students.map((student) => (
                <option value={student.id} key={student.id}>
                  {student.admission_number} - {student.name}
                </option>
              ))}
            </select>
          </div>
          <div
            ref={componentRef}
            className="perfomance-container"
            id="perfomance-container"
          >
            <div className="report-form-zone">
              <div className="results-form-table">
                <table>
                  <tbody>
                    <tr>
                      <th>Subject</th>
                      <th>Score</th>
                      <th>% Change</th>
                    </tr>
                    {examResults.map((result) => (
                      <tr key={result.id}>
                        <td>{result.subject_name}</td>
                        <td>
                          {result.score} {result.grade}
                        </td>
                        <td>
                          {result.percentage_change !== null ? (
                            <>
                              {result.percentage_change.toFixed(1)}%{" "}
                              {result.percentage_change > 0 ? (
                                <span style={{ color: "green" }}>&#9650;</span> // Up arrow for positive change
                              ) : result.percentage_change < 0 ? (
                                <span style={{ color: "red" }}>&#9660;</span> // Down arrow for negative change
                              ) : (
                                "" // No arrow for zero change
                              )}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="change-summary">
                  <p>
                    Total marks :{" "}
                    {examResults.reduce((acc, curr) => acc + curr.score, 0)} out
                    of {examResults.length * 100}
                  </p>
                  <u style={{ textDecoration: "underline" }}>Deviations</u>
                  <p>Previous Total : {previousTotal}</p>
                  <p>
                    Change :{" "}
                    {percentageChange ? percentageChange.toFixed(1) : "-"} %{" "}
                    {percentageChange !== null ? (
                      percentageChange >= 0 ? (
                        <span style={{ color: "green" }}>&#9650;</span>
                      ) : (
                        <span style={{ color: "red" }}>&#9660;</span>
                      )
                    ) : null}
                  </p>
                </div>
              </div>
            </div>
            <div className="report-bar-zone">
              <div className="report-form-header">
                <p>{schoolName}</p>
                <p>{examName}</p>
                <p>{studentName}</p>&nbsp;<h2>GRADE : {gradeLevel}</h2>
              </div>
              <h2
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                This year perfomance
              </h2>
              <ResultsChart examData={examWiseTotals} />
            </div>
          </div>
          {examResults.length > 0 && (
            <ReactToPrint
              trigger={() => (
                <button
                  style={{
                    background: "aqua",
                    width: "150px",
                    height: "40px",
                    marginBottom: "20px",
                    float: "right",
                  }}
                >
                  print results
                </button>
              )}
              content={() => componentRef.current}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ProgressData;
