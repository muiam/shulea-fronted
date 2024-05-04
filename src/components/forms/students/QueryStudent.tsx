import React, { useState, useEffect, SyntheticEvent } from "react";
import { useLocation } from "react-router-dom";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { ToastContainer, toast } from "react-toastify";

interface AcademicYear {
  id: number;
  name: string;
}

interface Exam {
  id: number;
  name: string;
}

interface Term {
  id: number;
  name: string;
}

interface StudentMark {
  id: Number;
  admission_number: string;
  name: string;
}

interface Student {
  student: Number;
}

function QueryStudent() {
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [allYear, setAllYear] = useState<AcademicYear[]>([]);
  const [allTerms, setAllTerm] = useState<Term[]>([]);
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([]);

  const location = useLocation();
  const {
    subjectIdentityId,
    subjectLevel,
    subjectLeveleStream,
    subjectName,
    subjectLevelId,
  } = location.state || {};

  useEffect(() => {
    fetch(getPrivateUrl("actions/allYears"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    })
      .then((response) => response.json())
      .then((data) => setAllYear(data))
      .catch((error) => console.error("Error fetching levels:", error));
  }, []);

  useEffect(() => {
    // Perform actions based on the updated studentMarks state
  }, [studentMarks]); // Depend on studentMarks state
  useEffect(() => {
    if (selectedYearId) {
      fetch(getPrivateUrl(`actions/allTerms?year=${selectedYearId}`), {
        method: "GET",
        headers: getHeadersWithAuth(),
      })
        .then((response) => response.json())
        .then((data) => setAllTerm(data))
        .catch((error) => console.error("Error fetching terms:", error));
    }
  }, [selectedYearId]);

  useEffect(() => {
    if (selectedYearId && selectedTermId) {
      fetch(
        getPrivateUrl(
          `actions/allExams?year=${selectedYearId}&term=${selectedTermId}`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      )
        .then((response) => response.json())
        .then((data) => setAllExams(data))
        .catch((error) => console.error("Error fetching exams:", error));
    }
  }, [selectedYearId, selectedTermId]);

  const fetchStudents = async (e: SyntheticEvent) => {
    e.preventDefault();
    let response = await fetch(getPrivateUrl("actions/fetch/exam/students"), {
      method: "POST",
      headers: getHeadersWithAuth(),
      body: JSON.stringify({
        year: selectedYearId,
        term: selectedTermId,
        exam: selectedExamId,
        level: subjectLevelId,
        subject: subjectIdentityId,
      }),
    });

    if (response.status == 200) {
      // throw new Error(`HTTP error! status: ${response.status}`);
      toast.success("success, students fetched");
      const data = await response.json();
      setStudentMarks(data);
    } else if (response.status == 404) {
      toast.error(
        "the students not found or they alreay have results for this exam"
      );
    } else {
      toast.error(
        "this process has returned an error. Contact your school or the tech support team"
      );
    }
  };

  const handleMarkChange = (admissionNumber: string, mark: number | "") => {
    const updatedMarks = studentMarks.map((student) =>
      student.admission_number === admissionNumber
        ? { ...student, mark }
        : student
    );
    setStudentMarks(updatedMarks);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let response = await fetch(getPrivateUrl("teacher/enter/marks"), {
      method: "POST",
      headers: getHeadersWithAuth(),
      body: JSON.stringify({
        level_id: subjectLevelId,
        year_id: selectedYearId,
        term_id: selectedTermId,
        exam_id: selectedExamId,
        subject_id: subjectIdentityId,
        marks: studentMarks,
      }),
    });

    if (response.status === 201) {
      const updatedStudentsResponse = await response.json();
      toast.success("addition well done");
      const updatedStudentIds = updatedStudentsResponse.map(
        (student: Student) => student.student
      );
      const updatedStudents = studentMarks.filter(
        (student) => !updatedStudentIds.includes(student.id)
      );
      console.log("unupdated", updatedStudents);
      setStudentMarks(updatedStudents);
    } else {
      toast.error("Failed to add marks");
    }
  };

  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div className="add-start-new">
          <h2 className="enter-mark-heading">
            Enter exam marks for {subjectName} Grade{" "}
            {subjectLeveleStream
              ? `${subjectLevel}${subjectLeveleStream}`
              : subjectLevel}
          </h2>
          {/* Form for selecting the year, term, exam, and grade */}
          <form className="form-container" id="results-add-form">
            <div
              className="form-select-container"
              id="results-add-form-selector"
            >
              <label htmlFor="academic">Academic Year</label>
              <select
                name=""
                id=""
                onChange={(e) => setSelectedYearId(Number(e.target.value))}
                value={selectedYearId || ""}
              >
                <option value="" disabled>
                  select Year
                </option>

                {allYear.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
              <label htmlFor="Term">Term</label>
              <select
                name=""
                id=""
                onChange={(e) => setSelectedTermId(Number(e.target.value))}
                value={selectedTermId || ""}
              >
                <option value="" disabled>
                  select Term
                </option>

                {allTerms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.name}
                  </option>
                ))}
              </select>
              <label htmlFor="grade">Exam</label>
              <select
                name=""
                id=""
                onChange={(e) => setSelectedExamId(Number(e.target.value))}
                value={selectedExamId || ""}
              >
                <option value="" disabled>
                  select exam
                </option>

                {allExams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="form-button" onClick={fetchStudents}>
              Get students
            </button>
          </form>
          <form onSubmit={handleSubmit} className="enter-mark-flex">
            <div className="default-table">
              <table>
                <tbody>
                  <tr>
                    <th>#</th>
                    <th>Nemis/Adm number</th>
                    <th>Name</th>
                    <th>Enter % mark</th>
                  </tr>

                  {studentMarks.map((student, index) => (
                    <tr key={student.admission_number}>
                      <td>{index + 1}</td>
                      <td>{student.admission_number}</td>
                      <td>{student.name}</td>
                      <td>
                        <input
                          type="number"
                          placeholder="enter % mark"
                          onChange={(e) =>
                            handleMarkChange(
                              student.admission_number,
                              e.target.value ? Number(e.target.value) : ""
                            )
                          }
                          min={1}
                          max={100}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {studentMarks.length > 0 && (
              <button type="submit" className="enter-mark-save-btn">
                Save
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default QueryStudent;
