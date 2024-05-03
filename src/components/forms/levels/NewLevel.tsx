import { SyntheticEvent, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function NewLevel() {
  const [level, setLevel] = useState<number>(0);
  const [stream, setStream] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (level > 0) {
      let response = await fetch(getPrivateUrl(`actions/levels`), {
        method: "POST",
        headers: getHeadersWithAuth(),
        body: JSON.stringify({
          name: level,
          stream: stream,
        }),
      });
      if (response.status == 201) {
        toast.success("done");
        navigate("/levels");
      } else {
        toast.error("there was an error. Either level entered is zero");
      }
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
              <label htmlFor="name">grade/year</label>
              <input
                type="number"
                min={1}
                max={15}
                value={level}
                placeholder="eg 1, 3 ,8 etc"
                name="name"
                onChange={(e) => setLevel(parseFloat(e.target.value))}
                className="add-input"
              />
            </div>
            <div className="add-form">
              <label htmlFor="name">stream (optional)</label>
              <input
                type="text"
                value={stream}
                placeholder="stream"
                name="eg A , south etc"
                onChange={(e) => setStream(e.target.value)}
                className="add-input"
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

export default NewLevel;
