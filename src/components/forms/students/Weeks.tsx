import { useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { ToastContainer, toast } from "react-toastify";
interface WeekData {
  week: {
    id: number;
    name: string;
    school: number;
  };
  reports: number;
}

function Weeks() {
  const [weekData, setWeekData] = useState<WeekData[]>([]);

  useEffect(() => {
    getWeekData();
  }, []);
  const getWeekData = async () => {
    let response = await fetch(getPrivateUrl(`app/weeks/all-weeks-data`), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    if (response.status == 200) {
      toast.success("fetch successful");
      let data = await response.json();

      setWeekData(data);
    } else {
      toast.error("encountered an error");
    }
  };

  const newWeek = async () => {
    let response = await fetch(getPrivateUrl(`app/weeks/new/week`), {
      method: "POST",
      headers: getHeadersWithAuth(),
    });
    if (response.status == 201) {
      toast.error("well created");
    } else {
      toast.error("not created, maybe same week was being recreated");
    }
  };
  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "10px",
          }}
        >
          <div
            className=""
            style={{
              width: "300px",
              height: "40px",
              float: "right",
              display: "flex",
              marginTop: "10px",
              marginBottom: "10px",
              alignSelf: "flex-end",
            }}
          >
            <button
              style={{
                width: "100%",
                padding: "15px",
                height: "40px",
                background: "aqua",
                margin: "0",
              }}
              onClick={newWeek}
            >
              New
            </button>
          </div>
          <table className="default-table">
            <tbody>
              <tr>
                <th>#</th>
                <th>week</th>
                <th>Total reports</th>
              </tr>
              {weekData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.week.name}</td>
                  <td>{item.reports}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Weeks;
