import { useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../app/ApiRequest";
import MainNavbar from "../menus/MainNavbar";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

interface Subject {
  subjectIdentityId: number;
  id: number;
  name: string;
  required: boolean;
  level_name: number;
  level_id: number;
  level_stream?: string;
}

function LoggedTeacherSubjects() {
  const userData = useSelector((state: RootState) => state.auth);
  const [TeacherSubject, setTeacherSubject] = useState<Subject[]>([]);
  const [IsLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addSubject = (
    subjectIdentityId: number,
    subjectId: number,
    subjectName: string,
    subjectLevel: number,
    subjectLevelId: number,
    subjectLeveleStream?: string
  ) => {
    navigate("/students-data", {
      state: {
        subjectIdentityId,
        subjectId,
        subjectName,
        subjectLevel,
        subjectLeveleStream,
        subjectLevelId,
      },
    });
  };
  const getTeacherSubjects = async () => {
    setLoading(true);
    let response = await fetch(getPrivateUrl("teacher/mysubjects/"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    setLoading(false);
    let data = await response.json();
    console.log(data);
    setTeacherSubject(data);
  };

  useEffect(() => {
    getTeacherSubjects();
  }, []);
  return (
    <>
      <MainNavbar />
      <div className="app-content-start">
        <div className="add-start">
          <div className="subject-area">
            <div className="warning-tip">
              <div className="warning-icon">&#x1F6C8;</div>

              <span className="warning-text">
                Select a subject from this {TeacherSubject.length} and proceed
                to enter marks in respective year/exam/term for each indiviual
                student. Please note that you can only enter marks for subjects
                you teach at {userData.schoolName}
              </span>
            </div>

            <div className="assign-form">
              <div className="subject-grid">
                {IsLoading == true
                  ? "loading"
                  : TeacherSubject.map((subjectItem, index) => (
                      <div
                        className="subject-item"
                        key={index}
                        onClick={() =>
                          addSubject(
                            subjectItem.subjectIdentityId,
                            subjectItem.id,
                            subjectItem.name,
                            subjectItem.level_name,
                            subjectItem.level_id,
                            subjectItem.level_stream
                          )
                        }
                      >
                        {subjectItem.name} grade{" "}
                        {subjectItem.level_stream
                          ? subjectItem.level_name + subjectItem.level_stream
                          : subjectItem.level_name}
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoggedTeacherSubjects;
