import { SyntheticEvent, useState } from "react";
import { getPrivateUrl } from "../../app/ApiRequest";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function PasswordReset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get("uid");
  const token = urlParams.get("token");
  const checkStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++; // Check for minimum length
    if (password.match(/[A-Z]/)) score++; // Check for uppercase letter
    if (password.match(/[a-z]/)) score++; // Check for lowercase letter
    if (password.match(/[0-9]/)) score++; // Check for number
    if (password.match(/[^A-Za-z0-9]/)) score++; // Check for special character
    return score;
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setStrength(checkStrength(event.target.value));
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const passwordsMatch = password === confirmPassword;
  const submitPasswordChange = async (e: SyntheticEvent) => {
    e.preventDefault();
    let response = await fetch(
      getPrivateUrl(`reset-password/confirm/?uid=${uid}`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_password: password,
          token: token,
        }),
      }
    );
    if (response.status == 200) {
      //created
      toast.success("password reset successfully");
      navigate("/");
    } else if (response.status == 400) {
      toast.error("invalid reset link or link already expired");
    } else {
      toast.error(
        "an error occurred, please contact support or try again later"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="app-content-start">
        <div
          className="new-notification"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
            marginRight: "50px",
          }}
        >
          <form action="" onSubmit={submitPasswordChange}>
            <label htmlFor="password">Password</label>
            {!passwordsMatch && (
              <span
                style={{ color: "red", marginTop: "5px", display: "block" }}
              >
                passwords dont match
              </span>
            )}
            {passwordsMatch && password !== "" && (
              <span
                style={{ color: "green", marginTop: "5px", display: "block" }}
              >
                good, passwords match
              </span>
            )}
            <input
              type="password"
              name="password"
              autoComplete="off"
              placeholder="a password"
              style={{
                height: "40px",
                marginTop: "5px",
                width: "300px",
                textIndent: "10px",
                background: "aqua",
              }}
              value={password}
              onChange={handlePasswordChange}
            />
            <label htmlFor="cpassword">Confirm Password</label>
            <input
              type="password"
              name="cpassword"
              autoComplete="off"
              placeholder="a password"
              style={{
                textIndent: "10px",
                background: "aqua",
                height: "40px",
                marginTop: "5px",
                width: "300px",
              }}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <button
              type="submit"
              disabled={!passwordsMatch || strength < 5}
              style={{
                display: "flex",
                alignSelf: "flex-start",
                background: "aqua",
                width: "100px",
                height: "50px",
                alignItems: "center",
                cursor:
                  passwordsMatch && strength >= 5 ? "pointer" : "not-allowed",
                opacity: passwordsMatch && strength >= 5 ? "1" : "0.3",
              }}
            >
              Change
            </button>
            <div style={{ marginTop: "20px" }}>
              {strength === 0 && password !== "" && (
                <span style={{ color: "red" }}>Weak</span>
              )}
              {strength === 1 && <span style={{ color: "red" }}>Weak</span>}
              {strength === 2 && <span style={{ color: "red" }}>Fair</span>}
              {strength === 3 && <span style={{ color: "green" }}>Good</span>}
              {strength === 4 && <span style={{ color: "green" }}>Strong</span>}
              {strength === 5 && (
                <span style={{ color: "green" }}>Very Strong</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PasswordReset;
