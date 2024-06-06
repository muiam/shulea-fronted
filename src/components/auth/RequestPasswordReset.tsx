import { SyntheticEvent, useState } from "react";
import shulea300 from "../../../public/shulea-bw.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPrivateUrl } from "../../app/ApiRequest";

function RequestPasswordReset() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const handleReset = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    let response = await fetch(getPrivateUrl(`reset-password/`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    setLoading(false);
    if (response.status == 200) {
      //created
      toast.success("we send you an email to reset");
    } else if (response.status == 400) {
      toast.error("user with this email doesnt exist in our records");
    } else {
      toast.error("an error ocurred. Try again later or contact support");
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
              width: "300px",
              marginRight: "20px",
              height: "100px",
              marginTop: "20px",
              display: "flex",
              alignSelf: "flex-end",
            }}
          >
            <img
              src={shulea300}
              alt="shuilea logo"
              style={{
                width: "100%", // Make sure the image takes up the entire width of the div
                height: "100%", // Make sure the image takes up the entire height of the div
                objectFit: "cover", // Ensure the image covers the entire div
              }}
            />
          </div>
          <h1>Reset</h1>
          <form action="">
            <div className="login-form">
              <label htmlFor="email">email</label>
              <input
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#ecf0f1",
                  borderRadius: "8px",
                  height: "50px",
                }}
                placeholder="eg abc @gmail.com"
                required
                type="text"
                name="email"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-form">
              <button
                onClick={handleReset}
                style={{
                  background: "aqua",
                  width: "100%",
                  height: "50px",
                }}
              >
                {loading == true ? "Loading" : "Reset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RequestPasswordReset;
