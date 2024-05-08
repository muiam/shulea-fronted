import { useEffect, useRef, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactToPrint from "react-to-print";

interface Transaction {
  id: number;
  receipt_number: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  head_name: string;
}

function Ledger() {
  const [ledger, setLedgerData] = useState<Transaction[]>([]);
  const [revenue, setLedgerRevenue] = useState<number>(0);
  const [expenditure, setLedgerExpenditure] = useState<number>(0);
  const [balance, setLedgerBalance] = useState<number>(0);
  const navigate = useNavigate();
  const componentRef = useRef(null);

  useEffect(() => {
    ledgerData();
  }, []);

  const ledgerData = async () => {
    let response = await fetch(
      getPrivateUrl(`all/financial/our/school/transactions/`),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 200) {
      let data = await response.json();
      setLedgerData(data.transactions);
      setLedgerRevenue(data.revenue_sum);
      setLedgerExpenditure(data.expenditure_sum);
      setLedgerBalance(data.balance);
    } else {
      toast.error("process failed");
    }
  };
  const handleRevenue = () => {
    navigate("/new/revenue");
  };
  const handleExpenditure = () => {
    navigate("/new/expenditure");
  };
  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div
          className=""
          id="balances-flex"
          style={{
            display: "flex",
            marginTop: "20px",
            justifyContent: "space-between", // Aligning items with space between
            alignItems: "center", // Centering vertically
          }}
        >
          <div
            id="stats-flex-display"
            style={{
              display: "flex",
            }}
          >
            <div
              className=""
              style={{
                display: "flex",
                height: "50px",
                background: "aqua",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <p style={{ margin: "10px" }}>Revenue : KES {revenue}</p>
            </div>
            <div
              className=""
              style={{
                display: "flex",
                height: "50px",
                background: "aqua",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <p style={{ margin: "10px" }}>Expenditure KES {expenditure}</p>
            </div>
            <div
              className=""
              style={{
                display: "flex",
                height: "50px",
                background: "aqua",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <p style={{ margin: "10px" }}>Balance KES {balance}</p>
            </div>
          </div>

          <div className="ledger-btns" id="ledger-btns">
            <div className="new-payroll" id="new-payroll">
              <select
                name=""
                className="select-filter-items"
                id="select-sort-ledger-data"
                style={{ height: "100%", width: "100%" }}
              >
                <option>from</option>
                <option>10/1/2024</option>
              </select>
            </div>
            <div className="new-payroll" id="new-payroll">
              <button onClick={handleRevenue}>Credit</button>
            </div>
            <div className="new-payroll" id="new-payroll">
              <button onClick={handleExpenditure}>Debit</button>
            </div>
          </div>
        </div>

        <div ref={componentRef} style={{ marginRight: "10px" }}>
          <table className="default-table">
            <tbody>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Heading</th>
                <th>Description</th>
                <th>Receipt</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
              {ledger.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.type}</td>
                  <td>{item.head_name}</td>
                  <td>{item.description}</td>
                  <td>{item.receipt_number}</td>
                  <td>KES {item.amount}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={5} align="right">
                  <strong>Total Expenditure:</strong>
                </td>
                <td>
                  <strong>KES {expenditure}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={5} align="right">
                  <strong>Total Revenue:</strong>
                </td>
                <td>
                  <strong>KES {revenue}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={5} align="right">
                  <strong>Balance:</strong>
                </td>
                <td>
                  <strong>KES {balance}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {ledger.length > 0 && (
          <ReactToPrint
            trigger={() => (
              <button
                style={{
                  background: "aqua",
                  width: "100px",
                  float: "right",
                  marginRight: "10px",
                  height: "50px",
                }}
              >
                print
              </button>
            )}
            content={() => componentRef.current}
          />
        )}
      </div>
    </>
  );
}

export default Ledger;
