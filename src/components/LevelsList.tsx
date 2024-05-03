import MainNavbar from "./menus/MainNavbar";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { getHeadersWithAuth, getPrivateUrl } from "../app/ApiRequest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Level {
  id: number;
  name: number;
  stream?: string;

  // Add other properties as needed
}

const LevelList = () => {
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState<Level[]>([]);
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

  const levelData = async () => {
    try {
      setLoading(true);
      const response = await fetch(getPrivateUrl("actions/levels"), {
        method: "GET",
        headers: getHeadersWithAuth(),
      });

      if (response.ok) {
        const allLevelData = await response.json();
        setLevel(allLevelData);
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
    levelData();
  }, []); // Fetch teacher data on component mount

  const mergedResults = [...results, ...level];
  return (
    <>
      <MainNavbar />
      <div className="app-content-start">
        <div className="header">
          <h1>All {userData.schoolName} levels </h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            className="search-input"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <a href="/new/level" className="add-btn">
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
                  <th>level</th>
                  <th>stream?</th>
                </tr>

                {mergedResults.map((level, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {level.stream ? level.name + level.stream : level.name}
                    </td>
                    <td>{level.stream ? level.stream : "None"}</td>
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

export default LevelList;
