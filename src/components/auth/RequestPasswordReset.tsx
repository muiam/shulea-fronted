import { SyntheticEvent, useState } from "react";
import shulea300 from "../../../public/shulea-bw.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPrivateUrl } from "../../app/ApiRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

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

  const styles = {
    advert: {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      maxWidth: "600px",
      padding: "20px",
      borderRadius: "8px",
      textAlign: "center" as "center", // Corrected
    },
    advertTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    advertText: {
      fontSize: "16px",
      marginBottom: "20px",
    },
    advertList: {
      textAlign: "left" as "left", // Corrected
      listStyleType: "none",
      paddingLeft: "0",
    },
    advertListItem: {
      marginBottom: "10px",
    },
    contactSection: {
      marginTop: "30px",
    },
  };

  return (
    <>
      <ToastContainer />
      <div className="login-flex">
        <div className="login-wallpaper" id="login-wallpaper">
          <div style={styles.advert}>
            <h2 style={styles.advertTitle}>
              Why Choose Our School Management System?
            </h2>
            <p style={styles.advertText}>
              Our school management system offers comprehensive features to
              streamline administrative tasks, enhance communication, and
              improve overall efficiency. Here's why it's the best choice for
              your school:
            </p>
            <ul style={styles.advertList}>
              <li style={styles.advertListItem}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: "aqua", fontSize: "15px" }}
                />{" "}
                Efficient Student Management: Easily manage student information,
                progress and grades.
              </li>
              <li style={styles.advertListItem}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: "aqua", fontSize: "15px" }}
                />{" "}
                Effective Communication: Facilitate communication between
                teachers and parents.
              </li>
              <li style={styles.advertListItem}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: "aqua", fontSize: "15px" }}
                />{" "}
                CBC support : CBC curriculum supported with cambridge and
                edexcel also integrated
              </li>
              <li style={styles.advertListItem}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: "aqua", fontSize: "15px" }}
                />{" "}
                User-Friendly Interface: Intuitive design makes it easy for
                users to navigate and use the system.
              </li>
              <li style={styles.advertListItem}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: "aqua", fontSize: "15px" }}
                />{" "}
                Data visualizatiin: we show your data in graphs , bars and
                tables for easy interpretation
              </li>

              <li style={styles.advertListItem}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: "aqua", fontSize: "15px" }}
                />{" "}
                Secure and Reliable: Ensure data security and reliability with
                robust security measures.
              </li>
            </ul>
            <div style={styles.contactSection}>
              <h3>Contact Us for Subscription Enquiries</h3>
              <p>Email: info@example.com</p>
              <p>Phone: +254 714457130</p>
            </div>
          </div>
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
                  width: "300px",
                  padding: "10px",
                  background: "aqua",
                  borderRadius: "8px",
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
                  width: "100px",
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
