import MainNavbar from "./menus/MainNavbar";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { getHeadersWithAuth, getPrivateUrl } from "../app/ApiRequest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

interface Teacher {
  id: number;
  email: string;
  tscNo: number;
  first_name: string;
  last_name: string;
  is_active: boolean;
  employee_id: number;
  phone_number: number;
  gross_salary: number;
  // Add other properties as needed
}

const TeachersList = () => {
  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState<Teacher[]>([]);
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

  const teacherData = async () => {
    try {
      setLoading(true);
      const response = await fetch(getPrivateUrl("actions/teacher"), {
        method: "GET",
        headers: getHeadersWithAuth(),
      });

      if (response.ok) {
        const allTeacherData = await response.json();
        setTeacher(allTeacherData);
      } else if (response.status == 401) {
        // Handle non-OK responses
        toast.error("error fetching data");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    teacherData();
  }, []); // Fetch teacher data on component mount
  const activateTeacher = async (email: string) => {
    const response = await fetch(
      getPrivateUrl(`actions/deactivate/user/?email=${email}`),
      {
        method: "PUT",
        headers: getHeadersWithAuth(),
      }
    );

    if (response.ok) {
      toast.success("activated succesfully");
      setTeacher((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.email === email ? { ...teacher, is_active: true } : teacher
        )
      );
    } else {
      console.error("Failed to deactivate teacher:", response.statusText);
    }
  };

  const deactivateTeacher = async (email: string) => {
    const response = await fetch(
      getPrivateUrl(`actions/deactivate/user/?email=${email}`),
      {
        method: "PUT",
        headers: getHeadersWithAuth(),
      }
    );

    if (response.ok) {
      toast.success("deactivated successfully");
      setTeacher((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.email === email ? { ...teacher, is_active: false } : teacher
        )
      );
    } else {
      console.error("Failed to deactivate teacher:", response.statusText);
    }
  };

  const assignSubject = (id: number) => {
    navigate(`/assign-subjects/${encodeURIComponent(id || "placeholder")}`);
  };

  const mergedResults = [...results, ...teacher];
  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div className="header">
          <h1>All {userData.schoolName} teachers </h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            className="search-input"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <a href="/new/teacher" className="add-btn">
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
                  <th>Email</th>
                  <th>employee ID</th>
                  <th>first Name</th>
                  <th>Last Name</th>
                  <th>Gross salary</th>
                  <th>phone</th>
                  <th>status</th>
                  <th>Assign subjects</th>
                  <th>Action?</th>
                </tr>

                {mergedResults.map((teacher, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.employee_id}</td>
                    <td>{teacher.first_name}</td>
                    <td>{teacher.last_name}</td>
                    <td>{teacher.gross_salary}</td>
                    <td>{teacher.phone_number}</td>
                    <td>{teacher.is_active ? "Active" : "Inactive"}</td>
                    <td>
                      <button
                        className="end-btn"
                        onClick={() => assignSubject(teacher.id)}
                      >
                        <center>
                          <i className="fa-solid fa-add"></i>
                        </center>
                      </button>
                    </td>
                    <td>
                      {teacher.is_active ? (
                        <button
                          className="end-btn"
                          onClick={() => deactivateTeacher(teacher.email)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="end-btn"
                          onClick={() => activateTeacher(teacher.email)}
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

export default TeachersList;
