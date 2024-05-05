import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

import { AppDispatch } from "../../app/store";

import { useUnreadCount } from "./CommonFns";

export function TeacherMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const unreadCount = useUnreadCount();
  return (
    <nav>
      <ul>
        <li>
          <a href="/home">
            <i className="fa-solid fa-home"></i>
            <span className="nav-item">Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/my-subjects">
            <i className="fa-solid fa-book"></i>
            <span className="nav-item">Exams</span>
          </a>
        </li>
        <li>
          <a href="/year-exam">
            <i className="fa-solid fa-table"></i>
            <span className="nav-item">Ranks</span>
          </a>
        </li>
        <li>
          <a href="/students-progress">
            <i className="fa-solid fa-book-open"></i>
            <span className="nav-item">Progress</span>
          </a>
        </li>
        <li>
          <a href="/my-reports">
            <i className="fa-solid fa-file-import"></i>
            <span className="nav-item">kid reports</span>
          </a>
        </li>
        <li>
          <a href="/my-payslips/">
            <i className="fa-solid fa-dollar"></i>
            <span className="nav-item">My payslips</span>
          </a>
        </li>
        <li>
          <li>
            <a
              href="/all/my/updates"
              style={{
                position: "relative",
                display: "inline-block",
              }}
            >
              <i className="fa-solid fa-bell">
                {unreadCount > 0 && (
                  <span
                    className="unread-count"
                    style={{
                      backgroundColor: "#fa3e3e",
                      borderRadius: "50PX",
                      color: "white",
                      padding: "2px 3px",
                      fontSize: "15px",
                      position: "absolute",
                      bottom: "70%",
                      left: "50%",
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </i>
              <span className="nav-item">Updates</span>
            </a>
          </li>
        </li>

        <li>
          <a onClick={handLogout} className="logout">
            <i className="fa-solid fa-sign-out"></i>
            <span className="nav-item">Logout</span>
          </a>
        </li>
        <li>
          <a onClick={handLogout} className="logout">
            <i className="fa-solid fa-sign-out"></i>
            <span className="nav-item">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  );

  function handLogout() {
    dispatch(logout());
    navigate("/");
  }
}

export function HeadTeacherMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const unreadCount = useUnreadCount();

  function handLogout() {
    dispatch(logout());
    navigate("/");
  }

  return (
    <nav>
      <ul>
        <li>
          <a href="/home">
            <i className="fa-solid fa-home"></i>
            <span className="nav-item">Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/teachers">
            <i className="fa-solid fa-person-chalkboard"></i>
            <span className="nav-item">Teachers</span>
          </a>
        </li>
        <li>
          <a href="/parents">
            <i className="fa-solid fa-users"></i>
            <span className="nav-item">Parents</span>
          </a>
        </li>
        <li>
          <a href="/students">
            <i className="fa-solid fa-graduation-cap"></i>
            <span className="nav-item">Students</span>
          </a>
        </li>

        <li>
          <a href="/">
            <i className="fa-solid fa-dollar"></i>
            <span className="nav-item">Finance</span>
          </a>
        </li>
        <li>
          <a
            href="/all/my/updates"
            style={{ position: "relative", display: "inline-block" }}
          >
            <i className="fa-solid fa-bell">
              {unreadCount > 0 && (
                <span
                  className="unread-count"
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "0px",
                    minWidth: "16px",
                    height: "20px",
                    lineHeight: "20px",
                    textAlign: "center",
                    borderRadius: "50%",
                    color: "white",
                    backgroundColor: "red",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </i>
            <span className="nav-item">Updates</span>
          </a>
        </li>

        <li>
          <a onClick={handLogout} className="logout">
            <i className="fa-solid fa-sign-out"></i>
            <span className="nav-item">Logout</span>
          </a>
        </li>
        <li>
          <a onClick={handLogout} className="logout">
            <i className="fa-solid fa-sign-out"></i>
            <span className="nav-item">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export function ParentMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const unreadCount = useUnreadCount();
  function handLogout() {
    dispatch(logout());
    navigate("/");
  }
  return (
    <nav>
      <ul>
        <li>
          <a href="/home">
            <i className="fa-solid fa-home"></i>
            <span className="nav-item">Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/my/kid/progress">
            <i className="fa-solid fa-book-open"></i>
            <span className="nav-item">Progress</span>
          </a>
        </li>
        <li>
          <a href="/tuition/fee/">
            <i className="fa-solid fa-dollar"></i>
            <span className="nav-item">Fees</span>
          </a>
        </li>
        <li>
          <a href="/my/kid/reports">
            <i className="fa-solid fa-file-import"></i>
            <span className="nav-item">Kid reports</span>
          </a>
        </li>
        <li>
          <a
            href="/all/my/updates"
            style={{ position: "relative", display: "inline-block" }}
          >
            <i className="fa-solid fa-bell">
              {unreadCount > 0 && (
                <span
                  className="unread-count"
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "0px",
                    minWidth: "16px",
                    height: "20px",
                    lineHeight: "20px",
                    textAlign: "center",
                    borderRadius: "50%",
                    color: "white",
                    backgroundColor: "red",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </i>
            <span className="nav-item">Updates</span>
          </a>
        </li>

        <li>
          <a onClick={handLogout} className="logout">
            <i className="fa-solid fa-sign-out"></i>
            <span className="nav-item">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export function AccountantMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const unreadCount = useUnreadCount();

  function handLogout() {
    dispatch(logout());
    navigate("/");
  }
  return (
    <nav>
      <ul>
        <li>
          <a href="/home">
            <i className="fa-solid fa-home"></i>
            <span className="nav-item">Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/school-fees">
            <i className="fa-solid fa-receipt"></i>
            <span className="nav-item">Fees</span>
          </a>
        </li>
        <li>
          <a href="/wallet-balances">
            <i className="fa-solid fa-arrow-right"></i>
            <span className="nav-item">Fowarded</span>
          </a>
        </li>
        <li>
          <a href="/ledger">
            <i className="fa-solid fa-book"></i>
            <span className="nav-item">Ledger</span>
          </a>
        </li>
        <li>
          <a href="/payroll">
            <i className="fa-solid fa-dollar"></i>
            <span className="nav-item">Payroll</span>
          </a>
        </li>
        <li>
          <a
            href="/all/my/updates"
            style={{ position: "relative", display: "inline-block" }}
          >
            <i className="fa-solid fa-bell">
              {unreadCount > 0 && (
                <span
                  className="unread-count"
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "0px",
                    minWidth: "16px",
                    height: "20px",
                    lineHeight: "20px",
                    textAlign: "center",
                    borderRadius: "50%",
                    color: "white",
                    backgroundColor: "red",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </i>
            <span className="nav-item">Updates</span>
          </a>
        </li>

        <li>
          <a onClick={handLogout} className="logout">
            <i className="fa-solid fa-sign-out"></i>
            <span className="nav-item">Logout</span>
          </a>
        </li>

        <li>
          <a onClick={handLogout} className="logout">
            <i className="fa-solid fa-sign-out"></i>
            <span className="nav-item">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export function UserWelcome({ name }: { name: string }) {
  const initials = getInitials(name);
  const colors = initials.split("").map(() => getRandomColor());
  const navigate = useNavigate();

  return (
    <>
      <div className="user-welcome">
        <div className="name-arrow">
          {initials.split("").map((letter, index) => (
            <span
              key={index}
              style={{
                color: colors[index],
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: 39,
              }}
            >
              {letter}
            </span>
          ))}
          <button
            className="end-btn"
            onClick={() => navigate(`/change/password`)}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </>
  );
}
function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
