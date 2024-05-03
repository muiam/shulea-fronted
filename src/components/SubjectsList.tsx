import MainNavbar from "./menus/MainNavbar";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { getHeadersWithAuth, getPrivateUrl } from "../app/ApiRequest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Teacher {
  name: string;
  required: boolean;
  level: number;
  level_name: string;
  level_stream?: string;

  // Add other properties as needed
}

const SubjectsLists = () => {
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState<Teacher[]>([]);
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

  const subjectData = async () => {
    try {
      setLoading(true);
      const response = await fetch(getPrivateUrl("actions/subject"), {
        method: "GET",
        headers: getHeadersWithAuth(),
      });

      if (response.ok) {
        const allSubjectData = await response.json();
        setSubject(allSubjectData);
      } else if (response.status == 401) {
        // Handle non-OK responses
        console.error("Error fetching subject data:", response.statusText);
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching subject data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    subjectData();
  }, []); // Fetch teacher data on component mount

  const mergedResults = [...results, ...subject];
  return (
    <>
      <MainNavbar />
      <div className="app-content-start">
        <div className="header">
          <h1>All {userData.schoolName} subjects </h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            className="search-input"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <a href="/new/subject" className="add-btn">
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
                  <th>name</th>
                  <th>Grade</th>
                  <th>required?</th>
                </tr>

                {mergedResults.map((subject, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{subject.name}</td>
                    <td>
                      grade{" "}
                      {subject.level_stream
                        ? subject.level_name + "" + subject.level_stream
                        : subject.level_name}
                    </td>

                    <td>{subject.required ? "Yes" : "No"}</td>
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

export default SubjectsLists;
