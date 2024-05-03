import { SyntheticEvent, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { useNavigate } from "react-router-dom";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";

const AddParentForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleNewParent = async (e: SyntheticEvent) => {
    e.preventDefault();
    let response = await fetch(getPrivateUrl("actions/parent"), {
      method: "POST",
      headers: getHeadersWithAuth(),
      body: JSON.stringify({
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
      }),
    });
    if (response.status == 201) {
      console.log("success, we have emailed the teacher the login credentials");
      navigate("/parents");
    } else if (response.status == 400) {
      console.log("user already exists");
    } else if (response.status == 403) {
      console.log("you have no rights to perform this ");
    } else if (response.status == 401) {
      console.log("expired toke");
      localStorage.removeItem("access");
      navigate("/");
    } else {
      console.log("you are not authenticated");
    }
  };

  return (
    <>
      <MainNavbar />
      <div className="app-content-start">
        <div className="add-start">
          <h2>Proceed to admit a parent</h2>
          <form action="" className="new-record-form">
            <div className="add-form">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                value={email}
                placeholder="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className="add-input"
              />
            </div>
            <div className="add-form">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="first name"
                name="first_name"
                className="add-input"
              />
            </div>

            <div className="add-form">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder=" last name"
                name="last_name"
                className="add-input"
              />
            </div>

            <div className="add-form">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                name="password"
                className="add-input"
              />
            </div>

            <button className="add-record-btn" onClick={handleNewParent}>
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
};

export default AddParentForm;
