import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { ToastContainer, toast } from "react-toastify";

interface Subject {
  name: string;
  score: number | undefined;
  percentage: number;
  description: string;
}

interface Student {
  admission_number: string;
  name: string;
}

interface ExamResult {
  student: Student;
  subjects: Subject[];
  total_marks: number;
}

interface Level {
  stream?: string;
  id: number;
  name: string;
}

function ExamRanks() {
  const location = useLocation();
  const { year, term, exam } = location.state || {};
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  // const [resultsAvailable, setResultsAvailable] = useState(false);
  const [improvementData, setImprovementData] = useState<any>(null);
  const [dropData, setDropData] = useState<any>(null);
  const [classImprovementData, setClassImprovementData] = useState<any>(null);

  useEffect(() => {
    const fetchExamResults = async () => {
      if (selectedLevelId !== null) {
        try {
          const response = await fetch(
            getPrivateUrl(
              `exams/rank_students/${year}/${term}/${exam}/${selectedLevelId}`
            ),
            { method: "GET", headers: getHeadersWithAuth() }
          );
          if (response.ok) {
            const data = await response.json();
            setExamResults(data);
            // setResultsAvailable(data.length > 0);
            toast.success("fetch was successful with given creteria");
          } else {
            throw new Error("Failed to fetch exam results");
          }
        } catch (error) {
          console.error("Error fetching exam results:", error);
          toast.error("Error fetching exam results");
        }
      }
    };
    fetchExamResults();
  }, [year, term, exam, selectedLevelId]);

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

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = parseInt(e.target.value, 10);
    setSelectedLevelId(levelId);
  };

  useEffect(() => {
    const fetchImprovementData = async () => {
      if (selectedLevelId !== null && year && term && exam) {
        try {
          const response = await fetch(
            getPrivateUrl(
              `exams/subject_stats/${year}/${term}/${exam}/${selectedLevelId}`
            ),
            { method: "GET", headers: getHeadersWithAuth() }
          );
          if (response.ok) {
            const data = await response.json();
            setImprovementData(data.most_improved_per_subject);
          } else {
            throw new Error("Failed to fetch improvement data");
          }
        } catch (error) {
          console.error("Error fetching improvement data:", error);
        }
      }
    };

    fetchImprovementData();
  }, [year, term, exam, selectedLevelId]);

  useEffect(() => {
    const fetchByDroData = async () => {
      if (selectedLevelId !== null && year && term && exam) {
        try {
          const response = await fetch(
            getPrivateUrl(
              `exams/subject_drop_stats/${year}/${term}/${exam}/${selectedLevelId}`
            ),
            { method: "GET", headers: getHeadersWithAuth() }
          );
          if (response.ok) {
            const data = await response.json();
            setDropData(data.least_improved_per_subject);
          } else {
            throw new Error("Failed to fetch improvement data");
          }
        } catch (error) {
          console.error("Error fetching improvement data:", error);
        }
      }
    };

    fetchByDroData();
  }, [year, term, exam, selectedLevelId]);

  useEffect(() => {
    const fetchClassImprovementData = async () => {
      if (selectedLevelId !== null && year && term && exam) {
        try {
          const response = await fetch(
            getPrivateUrl(
              `exams/exam_stats/${year}/${term}/${exam}/${selectedLevelId}`
            ),
            { method: "GET", headers: getHeadersWithAuth() }
          );
          if (response.ok) {
            const data = await response.json();
            setClassImprovementData(data);
          } else {
            throw new Error("Failed to fetch improvement data");
          }
        } catch (error) {
          console.error("Error fetching improvement data:", error);
        }
      }
    };

    fetchClassImprovementData();
  }, [year, term, exam, selectedLevelId]);

  // const handlePrintResults = () => {
  //   const printableContent = document.getElementById("printable-content");
  //   if (printableContent) {
  //     const newWindow = window.open("", "_blank");
  //     if (newWindow) {
  //       newWindow.document.write(printableContent.innerHTML);
  //       newWindow.document.close();
  //       newWindow.print();
  //     }
  //   }
  // };

  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div className="add-start-new">
          <div className="grade-toggle">
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

            {/* {resultsAvailable && (
              <i
                className="fa-solid fa-print"
                onClick={handlePrintResults}
                style={{ color: "aqua" }}
              ></i>
            )} */}
          </div>
          <div className="default-table" id="printable-content">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nemis/Adm number</th>
                  <th>Name</th>
                  {examResults.length > 0 &&
                    examResults[0].subjects.map((subject) => (
                      <th key={subject.name}>{subject.name}</th>
                    ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {examResults.map((result, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{result.student.admission_number}</td>
                    <td>{result.student.name}</td>
                    {examResults[0].subjects.map((subject) => {
                      const subjectResult = result.subjects.find(
                        (s) => s.name === subject.name
                      );
                      return (
                        <td key={subject.name}>
                          {subjectResult
                            ? `${subjectResult.score} ${subjectResult.description}`
                            : "X"}
                        </td>
                      );
                    })}
                    <td>{result.total_marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="results-statistics">
              <h2>most improved by subject</h2>
              {improvementData && Object.keys(improvementData).length > 0 ? (
                <ul className="improvement-list">
                  {Object.values(improvementData).map(
                    (improvement: any, index: number) => (
                      <li key={index} className="improvement-item">
                        <div>
                          <strong>Subject Name:</strong>{" "}
                          {improvement.subject_name}
                        </div>
                        <div>
                          <strong>Student Name:</strong>{" "}
                          {improvement.student_name}
                        </div>
                        <div>
                          <strong>Admission Number:</strong>{" "}
                          {improvement.admission_number}
                        </div>
                        <div>
                          <strong style={{ color: "green" }}>Up by:</strong>{" "}
                          {improvement.improvement}
                        </div>
                        <div className="percentage-improvement">
                          <strong>Percentage up:</strong>{" "}
                          <span
                            style={{
                              color:
                                improvement.percentage_improvement >= 0
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {improvement.percentage_improvement.toFixed(2)}%
                            {improvement.percentage_improvement >= 0
                              ? " \u25B2"
                              : " \u25BC"}
                          </span>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No improvement data available</p>
              )}

              <h2>Least Improved By subject </h2>
              {dropData && Object.keys(dropData).length > 0 ? (
                <ul className="improvement-list">
                  {Object.values(dropData).map(
                    (improvement: any, index: number) => (
                      <li key={index} className="improvement-item">
                        <div>
                          <strong>Subject Name:</strong>{" "}
                          {improvement.subject_name}
                        </div>
                        <div>
                          <strong>Student Name:</strong>{" "}
                          {improvement.student_name}
                        </div>
                        <div>
                          <strong>Admission Number:</strong>{" "}
                          {improvement.admission_number}
                        </div>
                        <div>
                          <strong style={{ color: "red" }}>Down by:</strong>{" "}
                          {improvement.improvement}
                        </div>
                        <div className="percentage-improvement">
                          <strong>Percentage down:</strong>{" "}
                          <span
                            style={{
                              color:
                                improvement.percentage_improvement >= 0
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {improvement.percentage_improvement.toFixed(1)}%
                            {improvement.percentage_improvement >= 0
                              ? " \u25B2"
                              : " \u25BC"}
                          </span>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No data available</p>
              )}

              <h2>Class statistics</h2>
              {classImprovementData ? (
                <div className="class-improvement">
                  <p>
                    <strong>Average Marks (Current):</strong>{" "}
                    {classImprovementData.average_marks_current || "00"}
                  </p>
                  <p>
                    <strong>Average Marks (Previous):</strong>{" "}
                    {classImprovementData.average_marks_previous || "00"}
                  </p>
                  <p>
                    <strong>Percentage Change:</strong>{" "}
                    <span
                      style={{
                        color:
                          classImprovementData.percentage_change >= 0
                            ? "green"
                            : "red",
                      }}
                    >
                      {classImprovementData.percentage_change !== null
                        ? classImprovementData.percentage_change.toFixed(2) +
                          "%"
                        : "00%"}
                      {classImprovementData.percentage_change !== null &&
                        (classImprovementData.percentage_change >= 0
                          ? " \u25B2"
                          : " \u25BC")}
                    </span>
                  </p>
                </div>
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExamRanks;
