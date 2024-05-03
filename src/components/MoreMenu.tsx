import { useNavigate } from "react-router-dom";
import MainNavbar from "./menus/MainNavbar";

function MoreMenu() {
  const navigate = useNavigate();
  return (
    <>
      <MainNavbar />

      <div className="app-content-start" style={{ padding: "20px" }}>
        <div
          className="more-items"
          id="more-items"
          style={{
            display: "grid",
            gap: "10px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          <div
            className="single-item"
            id="menu-single-item"
            style={{ display: "flex", gap: "10px" }}
          >
            <button
              onClick={() => navigate("/subjects")}
              style={{
                padding: "10px 20px",
                backgroundColor: "aqua",
                color: "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Subjects
            </button>
            <button
              onClick={() => navigate("/subjects")}
              style={{
                padding: "10px 20px",
                backgroundColor: "aqua",
                color: "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Notifications
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MoreMenu;
