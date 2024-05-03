import { useEffect, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Level {
  name: string;
  id: number;
  stream?: string;
}
interface Student {
  id: number;
  admission_number: number;
  name: string;
}

interface Subject {
  id: number;
  level_name: string;
  name: string;
}
interface Week {
  id: number;
  name: string;
}
function ComposeAReport() {
  const [grade, setGrade] = useState<Level[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number>(0);
  const [student, setStudent] = useState<Student[]>([]);
  const [subject, setSubject] = useState<Subject[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<number>(0);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [week, setWeek] = useState<Week[]>([]);
  const [academic, setAcademic] = useState("");
  const [behavior, setBehavior] = useState("");
  const [goals, setGoals] = useState("");
  const [areasOfImprovement, setImprovement] = useState("");
  const [nextGoals, setnextGoals] = useState("");
  const [comments, setComments] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    getGrade();
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
  useEffect(() => {
    const fetchLearners = async () => {
      let response = await fetch(
        getPrivateUrl(`actions/student/level/${selectedGrade}`),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setStudent(data);
      }
    };
    fetchLearners();
  }, [selectedGrade]);

  useEffect(() => {
    const getSubject = async () => {
      let response = await fetch(
        getPrivateUrl(`actions/subject/level/${selectedGrade}`),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setSubject(data);
      }
    };
    getSubject();
  }, [selectedGrade]);

  useEffect(() => {
    const getWeekData = async () => {
      let response = await fetch(getPrivateUrl(`app/weeks/all-weeks`), {
        method: "GET",
        headers: getHeadersWithAuth(),
      });
      if (response.status == 200) {
        let data = await response.json();
        setWeek(data);
      }
    };
    getWeekData();
  }, [selectedGrade, selectedStudent, selectedSubject]);

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGrade = Number(e.target.value);
    setSelectedGrade(selectedGrade);
  };
  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStudent = Number(e.target.value);
    setSelectedStudent(selectedStudent);
  };
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubject = Number(e.target.value);
    setSelectedSubject(selectedSubject);
  };
  const handleWeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWeek = Number(e.target.value);
    setSelectedWeek(selectedWeek);
  };
  const saveReport = async () => {
    if (selectedGrade && selectedStudent && selectedSubject && selectedWeek) {
      let response = await fetch(
        getPrivateUrl(`app/student/my/progress/weekly/reports`),
        {
          method: "POST",
          headers: getHeadersWithAuth(),
          body: JSON.stringify({
            student: selectedStudent,
            subject: selectedSubject,
            level: selectedGrade,
            week: selectedWeek,
            academic_progress: academic,
            behavior_effort: behavior,
            goals_achieved: goals,
            improvement_areas: areasOfImprovement,
            comments: comments,
            next_week_goals: nextGoals,
          }),
        }
      );
      if (response.status == 201) {
        toast.success("report recorded for this learner");
        navigate(`/my-reports`);
      }
    } else {
      toast.error(
        "there was a problem when recording this report. Maybe it already exists"
      );
      window.location.reload();
    }
  };
  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div className="select-details">
          <select
            name=""
            id=""
            className="select-learner-details"
            onChange={handleGradeChange}
            value={selectedGrade || ""}
          >
            <option value="" disabled>
              grade
            </option>
            {grade.map((item, index) => (
              <option key={index} value={item.id}>
                {item.stream ? item.name + item.stream : item.name}
              </option>
            ))}
          </select>
          <select
            name=""
            id=""
            className="select-learner-details"
            value={selectedStudent || ""}
            onChange={handleStudentChange}
          >
            <option value="" disabled>
              student
            </option>
            {student.map((item, index) => (
              <option key={index} value={item.id}>
                {item.admission_number + " " + item.name}
              </option>
            ))}
          </select>
          <select
            name=""
            id=""
            className="select-learner-details"
            onChange={handleSubjectChange}
            value={selectedSubject}
          >
            <option value="" disabled>
              subject
            </option>
            {subject.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name} ({item.level_name})
              </option>
            ))}
          </select>
          <select
            name=""
            id=""
            className="select-learner-details"
            value={selectedWeek || ""}
            onChange={handleWeeChange}
          >
            <option value="" disabled>
              week
            </option>
            {week.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="weekly-report-form-zone" id="weekly-report-form-zone">
          <div>
            <h4>Academic progress?</h4>
            <textarea
              value={academic}
              onChange={(e) => setAcademic(e.target.value)}
              className="text-area-form-zone"
              name=""
              id=""
              cols={30}
              rows={10}
            ></textarea>
          </div>
          <div>
            <h4>Behavior and effort?</h4>
            <textarea
              value={behavior}
              onChange={(e) => setBehavior(e.target.value)}
              className="text-area-form-zone"
              name=""
              id=""
              cols={30}
              rows={10}
            ></textarea>
          </div>
          <div>
            <h4>Goals achieved?</h4>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="text-area-form-zone"
              name=""
              id=""
              cols={30}
              rows={10}
            ></textarea>
          </div>
          <div>
            <h4>Areas of improvement?</h4>
            <textarea
              value={areasOfImprovement}
              onChange={(e) => setImprovement(e.target.value)}
              className="text-area-form-zone"
              name=""
              id=""
              cols={30}
              rows={10}
            ></textarea>
          </div>
          <div>
            <h4>Any comments?</h4>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="text-area-form-zone"
              name=""
              id=""
              cols={30}
              rows={10}
            ></textarea>
          </div>
          <div>
            <h4>Next week/term Goals?</h4>
            <textarea
              value={nextGoals}
              onChange={(e) => setnextGoals(e.target.value)}
              className="text-area-form-zone"
              name=""
              id=""
              cols={30}
              rows={10}
            ></textarea>
          </div>
        </div>
        {!selectedGrade &&
        !selectedStudent &&
        !selectedSubject &&
        !selectedWeek &&
        !academic &&
        !goals &&
        !nextGoals &&
        !behavior &&
        !comments &&
        !areasOfImprovement ? (
          <button
            style={{
              background: "aqua",
              cursor: "progress",
              height: "50px",
              width: "200px",
              marginTop: "10px",
              marginBottom: "20px",
              float: "right",
              marginRight: "10px",
              opacity: "0.8",
            }}
            onClick={saveReport}
            disabled
          >
            save
          </button>
        ) : (
          <button
            style={{
              background: "aqua",
              height: "50px",
              width: "200px",
              marginTop: "10px",
              marginBottom: "20px",
              float: "right",
              marginRight: "10px",
            }}
            onClick={saveReport}
          >
            save
          </button>
        )}
      </div>
    </>
  );
}

export default ComposeAReport;
