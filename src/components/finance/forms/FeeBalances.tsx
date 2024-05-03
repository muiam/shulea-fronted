import { useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

interface FeeBalance {
  id: number;
  academic_year_name: string;
  student_name: string;
  level_name: string;
  amount: number;
}
interface Level {
  name: string;
  id: number;
  stream?: string;
}

function FeeBalances() {
  const params = useParams();
  const [FeeBalancesData, setFeeBalancesData] = useState<FeeBalance[]>([]);
  const [totals, setTotals] = useState<number | 0>(0);
  const [yearName, setYearName] = useState<string>("");
  const [grade, setGrade] = useState<Level[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number>(0);
  useEffect(() => {
    fetchFeeBalances();
  }, [selectedGrade]);

  useEffect(() => {
    getGrade();
  }, []);

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGrade = Number(e.target.value);
    setSelectedGrade(selectedGrade);
  };

  const getGrade = async () => {
    let response = await fetch(getPrivateUrl("actions/levels"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    if (response.status == 200) {
      let data = await response.json();
      setGrade(data);
    }
  };

  const fetchFeeBalances = async () => {
    if (selectedGrade) {
      let response = await fetch(
        getPrivateUrl(
          `all/financial/our/school/fee/balances/${params.year}/${selectedGrade}`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setFeeBalancesData(data.fee_balances);
        setTotals(data.total_amount);
        setYearName(data.academic_year);
      }
    } else {
      let response = await fetch(
        getPrivateUrl(`all/financial/our/school/fee/balances/${params.year}`),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        toast.success("fetch these fee balances based on your creteria");
        let data = await response.json();
        setFeeBalancesData(data.fee_balances);
        setTotals(data.total_amount);
        setYearName(data.academic_year);
      } else {
        toast.error("this process encountered an error");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div style={{ marginTop: "10px" }}>
          <select
            name=""
            id=""
            style={{
              width: "200px",
              background: "aqua",
              height: "50px",
              borderRadius: "7px",
            }}
            value={selectedGrade || ""}
            onChange={handleGradeChange}
          >
            <option value="">grade</option>
            {grade.map((item, index) => (
              <option key={index} value={item.id}>
                {item.stream ? item.name + item.stream : item.name}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            marginRight: "10px",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        >
          <table>
            <tbody>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Nemis/Adm number</th>
                <th>Grade</th>
                <th>Amount</th>
                <th>Receive</th>
              </tr>
              {FeeBalancesData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.student_name}</td>
                  <td>0123</td>
                  <td>Grade {item.level_name}</td>
                  <td>KES {item.amount}</td>
                  <td>
                    <button
                      style={{
                        width: "100%",
                        padding: "20px",
                        background: "aqua",
                      }}
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={4} align="right">
                  <strong>{yearName} Balance Total:</strong>
                </td>
                <td>
                  <strong>KES {totals}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default FeeBalances;
