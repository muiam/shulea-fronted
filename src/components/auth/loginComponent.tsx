import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { login } from "../../features/authSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getHeadersWithAuth, getPrivateUrl } from "../../app/ApiRequest";

interface CustomJwtPayload extends JwtPayload {
  email: string;
  type: string;
  school: string;
  first_name: string;
  second_name: string;
  school_name: string;
}

function loginComponent() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    // interact with backend api
    setLoading(true);
    const response = await fetch(getPrivateUrl(`auth/token/`), {
      method: "POST",
      headers: getHeadersWithAuth(),
      //      credentials: "include",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    setLoading(false);
    if (email == "") {
      toast.error("email is a required field");
    } else if (password == "") {
      toast.error("password is required");
    } else {
      if (response.status == 401) {
        toast.error("Invalid user credentials or user inactive");
      } else if (response.status == 400) {
        toast.error(
          "valid user credentials required. Contact your institution"
        );
      } else if (response.status == 200) {
        toast.success("Login success");
        let data = await response.json();
        const token = data["access"];
        const decodedToken = jwtDecode(token) as CustomJwtPayload;

        const email = decodedToken.email;
        const type = decodedToken.type;
        const firstName = decodedToken.first_name;
        const lastName = decodedToken.second_name;
        const school = decodedToken.school;
        const schoolName = decodedToken.school_name;
        dispatch(
          login({ email, type, firstName, lastName, school, schoolName })
        );
        localStorage.setItem("access", token);

        navigate("/home");
      } else {
        toast.error("unknown error occured, please contact your school");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="login-flex">
        <div className="login-wallpaper" id="login-wallpaper">
          <img
            style={{
              width: "100%",
              borderRadius: "8px",
            }}
            src="https://img.freepik.com/free-vector/geometric-gradient-futuristic-background_23-2149116406.jpg?w=740&t=st=1717650604~exp=1717651204~hmac=9a403c2a22a2147fbb7b0b3bb10f8bff4ea04b8f6e0ff5dcf89eba589c1b5989"
            loading="lazy"
            alt="shulea-login-bg-wallpaper"
          />
        </div>
        <div className="login-page">
          <div
            className=""
            style={{
              width: "calc(100% - 40px)",
              marginRight: "20px",
              height: "100px",
              marginTop: "20px",
              display: "flex",
              alignSelf: "flex-end",
              marginLeft: "20px",
            }}
          >
            <div className="logo-design">
              <div className="sitename-first">SHU</div>
              <h3 className="sitename-second">LEA</h3>
            </div>
          </div>
          <h1>Login</h1>
          <form action="">
            <div className="login-form">
              <label htmlFor="email">email</label>
              <input
                style={{
                  width: "100%",
                  padding: "10px",
                  height: "50px",
                  borderRadius: "8px",
                  background: "#ecf0f1",
                  textIndent: "10px",
                }}
                placeholder=" eg abc@gmail.com"
                required
                type="text"
                name="email"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="login-form">
              <label htmlFor="password">password</label>
              <input
                style={{
                  width: "100%",
                  padding: "10px",
                  height: "50px",
                  background: "#ecf0f1",
                  borderRadius: "8px",
                  textIndent: "10px",
                }}
                placeholder="a password"
                required
                type="password"
                name="password"
                value={password}
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="login-form">
              <button
                className="default-shulea-button"
                onClick={handleLogin}
                style={{
                  width: "100%",
                  height: "50px",
                }}
              >
                {loading ? (
                  <center>
                    <div className="loading"></div>
                  </center>
                ) : (
                  "Login"
                )}
              </button>
            </div>
            <p className="p-or">OR</p>
            <div className="login-form">
              <span style={{ fontSize: "inherit", color: "inherit" }}>
                Forgot password?{" "}
                <a
                  href="/request/reset"
                  style={{
                    textDecoration: "underline",
                    color: "inherit",
                    display: "inline",
                    fontSize: "20px",
                  }}
                >
                  Reset
                </a>
              </span>
              <div className="" style={{ marginTop: "20px" }}>
                Need a demo ?
                <button
                  className="default-shulea-button"
                  onClick={() => navigate("/signup-my-school")}
                  style={{ width: "100%", height: "50px" }}
                >
                  Request
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default loginComponent;
