import { SyntheticEvent, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AddTeacherForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const navigate = useNavigate();
  const handleNewTeacher = async (e: SyntheticEvent) => {
    e.preventDefault();
    let response = await fetch(getPrivateUrl("actions/teacher"), {
      method: "POST",
      headers: getHeadersWithAuth(),
      body: JSON.stringify({
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        employee_id: employeeId,
        phone_number: phone,
        gross_salary: salary,
      }),
    });
    if (response.status == 201) {
      toast.success(
        "success, we have emailed the teacher the login credentials"
      );
      navigate("/teachers");
    } else if (response.status == 400) {
      toast.error("user with same credentials already exists");
    } else if (response.status == 403) {
      toast.error("you have no rights to perform this ");
    } else if (response.status == 401) {
      toast.error("You are no longer authenticated");
      localStorage.removeItem("access");
      navigate("/");
    } else {
      toast.error("you are not authenticated");
    }
  };

  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div className="add-start">
          <h2>Proceed to Admit a teacher</h2>

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
              <label htmlFor="employeeId">Employee Id</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="eg tsc number or any identity id"
                name="employeeId"
                className="add-input"
              />
            </div>
            <div className="add-form">
              <label htmlFor="gross_salary">Gross salary</label>
              <input
                type="number"
                min={1000}
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Gross salary"
                name="gross_salary"
                className="add-input"
              />
            </div>
            <div className="add-form">
              <label htmlFor="phone">Phone number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder=" phone no"
                name="phone"
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

            <button className="add-record-btn" onClick={handleNewTeacher}>
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

export default AddTeacherForm;
