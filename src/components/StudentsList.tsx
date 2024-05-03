import MainNavbar from "./menus/MainNavbar";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { getHeadersWithAuth, getPrivateUrl } from "../app/ApiRequest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

interface Student {
  admission_number: string;
  name: string;
  parent: string;
  active: boolean;
  parent_name: string;
  level_name: number;
  level_stream?: string;
  // Add other properties as needed
}

const StudentsList = () => {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (searchTerm) {
      fetch(getPrivateUrl(`teachers/search/?q=${searchTerm}`), {
        headers: getHeadersWithAuth(),
      })
        .then((response) => response.json())
        .then((data) => {
          setResults(data);
        });
    }
  }, [searchTerm]);

  const studentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(getPrivateUrl("actions/student"), {
        method: "GET",
        headers: getHeadersWithAuth(),
      });

      if (response.ok) {
        const allStudentData = await response.json();
        setStudent(allStudentData);
      } else if (response.status == 401) {
        toast.error("error fetching student data");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    studentData();
  }, []); // Fetch teacher data on component mount
  const activateStudent = async (admission_number: string) => {
    const response = await fetch(
      getPrivateUrl(`actions/deactivate/user/?email=${admission_number}`),
      {
        method: "PUT",
        headers: getHeadersWithAuth(),
      }
    );

    if (response.ok) {
      toast.success("activated successfully");
      setStudent((prevStudents) =>
        prevStudents.map((student) =>
          student.admission_number === admission_number
            ? { ...student, active: true }
            : student
        )
      );
    } else {
      console.error("Failed to deactivate student:", response.statusText);
    }
  };

  const deactivateStudent = async (admission_number: string) => {
    const response = await fetch(
      getPrivateUrl(`actions/deactivate/user/?email=${admission_number}`),
      {
        method: "PUT",
        headers: getHeadersWithAuth(),
      }
    );

    if (response.ok) {
      toast.error("deactivated successfully");
      setStudent((prevStudents) =>
        prevStudents.map((student) =>
          student.admission_number === admission_number
            ? { ...student, active: false }
            : student
        )
      );
    } else {
      console.error("Failed to deactivate teacher:", response.statusText);
    }
  };

  const mergedResults = [...results, ...student];
  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div className="header">
          <h1>All {userData.schoolName} students </h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            className="search-input"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <a href="/new/student" className="add-btn">
            New
          </a>
        </div>
        {loading ? (
          <center>
            <p>please wait ....</p>
          </center>
        ) : (
          <div className="teachers-table">
            <table>
              <tbody>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Admisson Number</th>
                  <th>current level</th>
                  <th>parent</th>
                  <th>status</th>
                  <th>Action?</th>
                </tr>

                {mergedResults.map((student, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.admission_number}</td>
                    <td>
                      grade{" "}
                      {student.level_stream
                        ? student.level_name + " " + student.level_stream
                        : student.level_name}
                    </td>
                    <td>{student.parent_name}</td>
                    <td>{student.active ? "Active" : "Inactive"}</td>
                    <td>
                      {student.active ? (
                        <button
                          className="end-btn"
                          onClick={() =>
                            deactivateStudent(student.admission_number)
                          }
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="end-btn"
                          onClick={() =>
                            activateStudent(student.admission_number)
                          }
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentsList;
