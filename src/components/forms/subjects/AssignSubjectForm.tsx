import { useParams } from "react-router-dom";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { SyntheticEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

interface Subject {
  id: number;
  name: string;
  required: boolean;
  level_name: number;
  level_stream?: string;
}

function AssignSubjectForm() {
  const { id } = useParams();

  const [subject, setSubject] = useState<Subject[]>([]);
  const [TeacherSubject, setTeacherSubject] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const decodedId = decodeURIComponent(id || "");

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    subjectId: number
  ): void => {
    const isChecked = event.target.checked;
    setSelectedSubjects((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, subjectId];
      } else {
        return prevSelected.filter((id) => id !== subjectId);
      }
    });
  };

  if (decodedId === "placeholder" || decodedId == "") {
    return (
      <div className="missing-error">
        <div className="error-text">
          <p>Error, missing parameter detected</p>
          <div className="error-btn">
            <a href="/teachers">Go back</a>
          </div>
        </div>
      </div>
    );
  }

  const subjectsData = async () => {
    const response = await fetch(getPrivateUrl("actions/free/subjects"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    if (response.status == 200) {
      let data = await response.json();
      setSubject(data);
    }
  };

  useEffect(() => {
    subjectsData();
    getTeacherSubjects();
  }, []);

  const handleAssignation = async (e: SyntheticEvent) => {
    e.preventDefault();

    let remainingSubjects = [...subject];
    let newTeacherSubjects = [...TeacherSubject];

    // Loop through each selected subject and send a POST request for each
    for (const subjectId of selectedSubjects) {
      const response = await fetch(getPrivateUrl("actions/assignSubject"), {
        method: "POST",
        headers: {
          ...getHeadersWithAuth(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher: decodedId,
          subject: subjectId, // Send a single subject ID
        }),
      });

      // Check the response status and handle accordingly
      if (response.status == 201) {
        toast.success("succesfully assigned this teacher the subject (s)");
        remainingSubjects = remainingSubjects.filter(
          (sub) => sub.id !== subjectId
        );
        const newSubject = subject.find((sub) => sub.id === subjectId);
        if (newSubject) {
          newTeacherSubjects.push(newSubject);
        }
      } else if (response.status == 400) {
        toast.error("bad request, subject might have been assigned");
      }
    }
    setSubject(remainingSubjects);
    setTeacherSubject(newTeacherSubjects);
  };

  const getTeacherSubjects = async () => {
    const response = await fetch(
      getPrivateUrl(`actions/assignSubject?teacher=${id}`),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );

    if (response.status == 200) {
      let data = await response.json();
      setTeacherSubject(data);
      toast.error("process successful");
    } else {
      toast.error("this process encountered an error");
    }
  };

  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div className="add-start">
          <h2>Assign subjects to this teacher</h2>
          {subject.length === 0 ? (
            <div className="missing-error" id="missing-error">
              <div className="error-text" id="error-text">
                <p>No unassigned subjects found</p>
                <div className="error-btn" id="show-error-btn">
                  <a href="/teachers">Go back</a>
                </div>
              </div>
            </div>
          ) : (
            <div className="subject-area">
              <div className="warning-tip">
                <div className="warning-icon">&#x1F6C8;</div>

                <span className="warning-text">
                  Required subject are mandatory subjects for complete
                  endsem/term exam reports
                </span>
              </div>
              <form action="" className="new-assign-form">
                <div className="assign-form">
                  <div className="subject-grid">
                    {subject.map((subjectItem) => (
                      <div key={subjectItem.id} className="subject-item">
                        <input
                          type="checkbox"
                          className="subject-checkbox"
                          id={`subject-${subjectItem.id}`}
                          name={subjectItem.name}
                          checked={selectedSubjects.includes(subjectItem.id)}
                          onChange={(event) =>
                            handleCheckboxChange(event, subjectItem.id)
                          }
                        />
                        <label
                          className="subject-label"
                          htmlFor={`subject-${subjectItem.id}`}
                        >
                          {subjectItem.name} - grade{" "}
                          {subjectItem.level_stream
                            ? subjectItem.level_name +
                              " " +
                              subjectItem.level_stream
                            : subjectItem.level_name}{" "}
                          {subjectItem.required ? "Required" : "Not required"}
                        </label>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleAssignation} className="assign-btn">
                    Assign Subjects
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="subjects-assigned">
          <p className="subject-assign-heading">
            Found {TeacherSubject.length} subjects for this teacher
          </p>

          <div className="teachers-table">
            <table>
              <tr>
                <th>#</th>
                <th>subject</th>
                <th>level</th>
                <th>Required?</th>
                <th>Action?</th>
              </tr>

              {TeacherSubject.map((TeacherSubject, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{TeacherSubject.name}</td>
                  <td>
                    Grade{" "}
                    {TeacherSubject.level_stream
                      ? TeacherSubject.level_name +
                        "" +
                        TeacherSubject.level_stream
                      : TeacherSubject.level_name}
                  </td>
                  <td>{TeacherSubject.required ? "Yes" : "No"}</td>
                  <td>
                    <button className="assign-btn">Deactivate</button>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AssignSubjectForm;
