import { UserWelcome } from "../menus/CustomMenu";
function HeadTeacher() {
  const userDetails = localStorage.getItem("userDetails");
  const user = userDetails ? JSON.parse(userDetails) : null;
  return (
    <>
      <div className="div-right">
        <UserWelcome
          name={user.firstName + " " + user.lastName || "New User"}
        />
      </div>
      <div className="dashboard-statistics">
        <div className="dashboard-holder">
          <div className="container-dashboard">
            <p>100</p>
            <h4>Teachers</h4>
          </div>

          <div className="container-dashboard">
            <p>100</p>
            <h4>Teachers</h4>
          </div>
          <div className="container-dashboard">
            <p>100</p>
            <h4>Teachers</h4>
          </div>
          <div className="container-dashboard">
            <p>100</p>
            <h4>Teachers</h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeadTeacher;
