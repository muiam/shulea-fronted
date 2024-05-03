import { SyntheticEvent, useEffect, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Level {
  stream?: string;
  id: number;
  name: string;
}

function AddSubjectForm() {
  const [name, setName] = useState("");
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);

  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  // Function to handle checkbox change
  const handleCheckboxChange = (event: any) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    fetch(getPrivateUrl("actions/levels"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch levels");
        }
        return response.json();
      })
      .then((data) => setLevels(data))
      .catch((error) => console.error("Error fetching levels:", error));
  }, []);
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = parseInt(e.target.value);
    setSelectedLevelId(levelId);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    let response = await fetch(getPrivateUrl(`actions/subject`), {
      method: "POST",
      headers: getHeadersWithAuth(),
      body: JSON.stringify({
        name: name,
        required: isChecked,
        level: selectedLevelId,
      }),
    });
    if (response.status == 201) {
      toast.success("done");
      navigate("/subjects");
      setIsChecked(false);
      setName("");
      setSelectedLevelId(null);
    } else {
      toast.error("there was an error");
      setIsChecked(false);
      setName("");
      setSelectedLevelId(null);
    }
  };
  return (
    <>
      <MainNavbar />
      <ToastContainer />
      <div className="app-content-start">
        <div className="add-start">
          <form action="" className="new-record-form" onSubmit={handleSubmit}>
            <div className="add-form">
              <label htmlFor="name">Subject</label>
              <input
                type="text"
                value={name}
                placeholder="name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                className="add-input"
              />
            </div>

            <div className="add-form">
              <label htmlFor="level">grade</label>
              <select
                name=""
                id=""
                onChange={handleLevelChange}
                value={selectedLevelId || ""}
              >
                <option value="" disabled>
                  level
                </option>
                {levels.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.stream ? item.name + item.stream : item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-form">
              <label htmlFor="requured">required</label>
              <input
                type="checkbox"
                name="required"
                value={isChecked ? "true" : "false"}
                style={{ marginBottom: 0 }}
                onChange={handleCheckboxChange}
              />
            </div>

            <button type="submit" className="add-record-btn">
              save
            </button>
          </form>

          {/* <details>
                  <p>
                    We shall email the above email the login credentials . Please
                    advise your teachers to always change their passwords on first
                    time login
                  </p>
                </details> */}
        </div>
      </div>
    </>
  );
}

export default AddSubjectForm;
