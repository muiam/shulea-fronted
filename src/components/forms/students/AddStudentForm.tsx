import { SyntheticEvent, useEffect, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { useNavigate } from "react-router-dom";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { ToastContainer, toast } from "react-toastify";

interface Parent {
  name: string;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface Level {
  id: number;
  name: string;
  stream?: string;
}
interface Curriculum {
  id: number;
  name: string;
}

const AddStudentForm = () => {
  const [parent, setParents] = useState<Parent[]>([]);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [allLevels, setAllLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [studentParent, setStudentParent] = useState("");
  const [curriculum, setCurriculum] = useState<Curriculum[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<number>(0);
  const navigate = useNavigate();
  const handleNewStudent = async (e: SyntheticEvent) => {
    e.preventDefault();
    let response = await fetch(getPrivateUrl("actions/student"), {
      method: "POST",
      headers: getHeadersWithAuth(),
      body: JSON.stringify({
        admission_number: admissionNumber,
        name: name,
        parent: studentParent,
        current_level: selectedLevelId,
        curriculum: selectedCurriculum,
      }),
    });
    if (response.status == 201) {
      toast.success("success, we have enrolled a new student");
      navigate("/students");
    } else if (response.status == 400) {
      toast.error("student  already exists");
    } else if (response.status == 403) {
      toast.error("you have no rights to perform this ");
    } else if (response.status == 401) {
      toast.error("expired token/ authentication");
      localStorage.removeItem("access");
      navigate("/");
    } else if (response.status == 500) {
      toast.error("some details may be missing");
    } else {
      toast.error("unkown error occured. Contact support");
      navigate("/");
    }
  };

  useEffect(() => {
    fetch(getPrivateUrl("actions/parent"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    })
      .then((response) => response.json())
      .then((data) => {
        setParents(data);
      })
      .catch((error) => console.error("Error fetching parent names:", error));
  }, []);

  useEffect(() => {
    fetch(getPrivateUrl("app/fetch/curriculum/all"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    })
      .then((response) => response.json())
      .then((data) => {
        setCurriculum(data);
      })
      .catch((error) => console.error("Error fetching parent names:", error));
  }, []);

  useEffect(() => {
    fetch(getPrivateUrl("actions/levels"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    })
      .then((response) => response.json())
      .then((data) => {
        setAllLevels(data); // Assuming data is an array of Level objects
      })
      .catch((error) => console.error("Error fetching levels:", error));
  }, []);

  return (
    <>
      <MainNavbar />
      <ToastContainer />
      <div className="app-content-start">
        <div className="add-start">
          <h2>Proceed to admit a student</h2>
          <form action="" className="new-record-form">
            <div className="add-form">
              <label htmlFor="email">Adm Number</label>
              <input
                type="text"
                value={admissionNumber}
                placeholder="Admission Number"
                name="admissionNumber"
                onChange={(e) => setAdmissionNumber(e.target.value)}
                className="add-input"
              />
            </div>
            <div className="add-form">
              <label htmlFor="full-name">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="full name"
                name="full-name"
                className="add-input"
              />
            </div>

            <div className="add-form">
              <label htmlFor="parent">parent</label>
              <select
                name="parent"
                id=""
                onChange={(e) => setStudentParent(e.target.value)}
                value={studentParent}
              >
                <option value="" disabled>
                  choose a parent
                </option>
                {parent.map((parent, index) => (
                  <option key={index} value={parent.id}>
                    {parent.email +
                      "  name: " +
                      parent.first_name +
                      "" +
                      parent.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-form">
              <label htmlFor="level">Grade?</label>
              <select
                name=""
                id=""
                onChange={(e) => setSelectedLevelId(Number(e.target.value))}
                value={selectedLevelId || ""}
              >
                <option value="" disabled>
                  select grade
                </option>

                {allLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    grade{" "}
                    {level.stream ? level.name + "" + level.stream : level.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-form">
              <label htmlFor="curriculum">Curriculum?</label>
              <select
                name="curriculum"
                id=""
                onChange={(e) => setSelectedCurriculum(Number(e.target.value))}
                value={selectedCurriculum || ""}
              >
                <option value="" disabled>
                  select curriculum
                </option>

                {curriculum.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="add-record-btn" onClick={handleNewStudent}>
              save
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddStudentForm;
