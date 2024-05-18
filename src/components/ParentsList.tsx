import MainNavbar from "./menus/MainNavbar";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { getHeadersWithAuth, getPrivateUrl } from "../app/ApiRequest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

interface Parent {
  email: string;
  tscNo: number;
  first_name: string;
  last_name: string;
  is_active: boolean;
  phone_number: string;
  // Add other properties as needed
}

const ParentsList = () => {
  const [loading, setLoading] = useState(false);
  const [parent, setParent] = useState<Parent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (searchTerm) {
      fetch(getPrivateUrl(`parents/search/?q=${searchTerm}`), {
        headers: getHeadersWithAuth(),
      })
        .then((response) => response.json())
        .then((data) => {
          setResults(data);
        });
    }
  }, [searchTerm]);

  const parentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(getPrivateUrl("actions/parent"), {
        method: "GET",
        headers: getHeadersWithAuth(),
      });

      if (response.ok) {
        const allParentData = await response.json();
        setParent(allParentData);
      } else if (response.status == 401) {
        // Handle non-OK responses
        navigate("/");
        toast.error("problem fetching data");
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    parentData();
  }, []); // Fetch teacher data on component mount
  const activateParent = async (email: string) => {
    const response = await fetch(
      getPrivateUrl(`actions/deactivate/user/?email=${email}`),
      {
        method: "PUT",
        headers: getHeadersWithAuth(),
      }
    );

    if (response.ok) {
      toast.success("activated successfully");
      setParent((prevParents) =>
        prevParents.map((parent) =>
          parent.email === email ? { ...parent, is_active: true } : parent
        )
      );
    } else {
      console.error("Failed to deactivate parent:", response.statusText);
    }
  };

  const deactivateParent = async (email: string) => {
    const response = await fetch(
      getPrivateUrl(`actions/deactivate/user/?email=${email}`),
      {
        method: "PUT",
        headers: getHeadersWithAuth(),
      }
    );

    if (response.ok) {
      toast.success("successfully deactivated");
      setParent((prevParents) =>
        prevParents.map((parent) =>
          parent.email === email ? { ...parent, is_active: false } : parent
        )
      );
    } else {
      console.error("Failed to deactivate teacher:", response.statusText);
    }
  };

  const mergedResults = [...results, ...parent];
  return (
    <>
      <MainNavbar />
      <ToastContainer />
      <div className="app-content-start">
        <div className="header">
          <h1>All {userData.schoolName} parents </h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            className="search-input"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <a href="/new/parent" className="add-btn">
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
                  <th>first Name</th>
                  <th>Last Name</th>
                  <th>phone</th>
                  <th>Action?</th>
                </tr>

                {mergedResults.map((parent, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{parent.email}</td>
                    <td>{parent.first_name}</td>
                    <td>{parent.last_name}</td>
                    <td>{parent.phone_number}</td>
                    <td>
                      {parent.is_active ? (
                        <button
                          className="end-btn"
                          onClick={() => deactivateParent(parent.email)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="end-btn"
                          onClick={() => activateParent(parent.email)}
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

export default ParentsList;
