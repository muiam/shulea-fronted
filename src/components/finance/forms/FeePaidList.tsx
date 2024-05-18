import { useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

interface StudentData {
  student_level: string;
  outstanding_balance: number;
  total_paid: number;
  overpaid: number;
  student_name: string;
  student_adm: string;
  required: number;
}

function FeePaidList() {
  const [fee, setFeeData] = useState<StudentData[]>([]);
  const params = useParams();
  const [totalPaid, setTotalPaid] = useState<number | 0>(0);
  const [totalExpected, setExpectedAmount] = useState<number | 0>(0);
  const [balance, setTotalBalance] = useState<number | 0>(0);
  const [percentage, setPercentage] = useState<number | 0>(0);

  useEffect(() => {
    feeData();
  }, []);
  const feeData = async () => {
    let response = await fetch(
      getPrivateUrl(
        `all/financial/our/school/fee/paid/list/${params.year}/${params.term}/${params.grade}/${params.fee}`
      ),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 200) {
      let data = await response.json();
      setFeeData(data.student_balances);
      console.log(data.totals["expected_amount"]);
      setExpectedAmount(data.totals["expected_amount"]);
      setTotalBalance(data.totals["total_balance"]);
      setTotalPaid(data.totals["total_paid"]);
      setPercentage(data.totals["percentage_paid"]);
    } else {
      toast.error("process failed");
    }
  };
  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div style={{ marginRight: "20px", marginTop: "20px" }}>
          <table>
            <tbody>
              <tr>
                <th>#</th>
                <th>Adm/Nemis Number</th>
                <th>student</th>
                <th>Grade</th>
                <th>Total Paid</th>
                <th>Required</th>
                <th>Balance</th>
                <th>Fowarded</th>
                <th>Remind</th>
              </tr>

              {fee.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.student_adm}</td>
                  <td>{item.student_name}</td>
                  <td>{item.student_level}</td>
                  <td>KES {item.total_paid}</td>
                  <td>KES {item.required}</td>
                  <td>KES {item.outstanding_balance}</td>
                  <td>KES {item.overpaid}</td>

                  {item.total_paid == 0 || item.total_paid < item.required ? (
                    <td>
                      <button
                        style={{
                          height: "50px",
                          width: "100%",
                          padding: "20px",
                          background: "aqua",
                        }}
                      >
                        remind
                      </button>
                    </td>
                  ) : (
                    <td>
                      <button
                        disabled
                        style={{
                          cursor: "not-allowed",
                          opacity: "0.6",
                          height: "50px",
                          width: "100%",
                          padding: "20px",
                          background: "aqua",
                        }}
                      >
                        remind
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              <tr>
                <td colSpan={4} align="right">
                  <strong>Totals:</strong>
                </td>
                <td>
                  <strong>KES {totalPaid}</strong>
                </td>
                <td>
                  <strong>KES {totalExpected} </strong>
                </td>
                <td>
                  <strong>KES {balance}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: "10px" }}>
            Total amount collected is {totalPaid} out of {totalExpected} or{" "}
            {percentage}% of the term fee
          </p>
          {percentage >= 100 ? (
            <div
              style={{
                marginTop: "10px",
                marginBottom: "50px",
                width: "60%",
                backgroundColor: "white",
                borderRadius: "8px",
                height: "20px",
                border: "2px solid black",
                overflow: "hidden", // Add overflow property to the outer div
              }}
            >
              <div
                style={{
                  width: "100%", // Set the width to 100% to prevent overflow
                  backgroundColor: "aqua",
                  borderRadius: "8px",
                  height: "100%",
                }}
              ></div>
            </div>
          ) : (
            <div
              style={{
                marginTop: "10px",
                marginBottom: "50px",
                width: "60%",
                backgroundColor: "white",
                borderRadius: "8px",
                height: "20px",
                border: "2px solid black",
                overflow: "hidden", // Add overflow property to the outer div
              }}
            >
              <div
                style={{
                  width: `${percentage} %`, // Set the width to 100% to prevent overflow
                  backgroundColor: "aqua",
                  borderRadius: "8px",
                  height: "100%",
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FeePaidList;
