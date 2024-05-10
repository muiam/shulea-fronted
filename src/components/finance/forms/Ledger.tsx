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
  const [dates, setDates] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const navigate = useNavigate();
  const componentRef = useRef(null);

  useEffect(() => {
    ledgerDates();
  }, []);

  useEffect(() => {
    ledgerData();
  }, [toDate]);

  const ledgerData = async () => {
    if (fromDate && toDate) {
      let response = await fetch(
        getPrivateUrl(
          `all/financial/our/school/transactions/${fromDate}/${toDate}`
        ),
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
    } else {
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
    }
  };

  const ledgerDates = async () => {
    let response = await fetch(
      getPrivateUrl(`all/financials/our/school/ledger/items/sort/ranges/dates`),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 200) {
      let data = await response.json();
      setDates(data.all_transaction_dates);
    } else {
      toast.error("process failed");
    }
  };
  const handleFromDateChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setToDate(event.target.value);
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
              <p style={{ margin: "10px" }}>Revenue: KES {revenue}</p>
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
              <p style={{ margin: "10px" }}>Expenditure: KES {expenditure}</p>
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
              <p style={{ margin: "10px" }}>Balance: KES {balance}</p>
            </div>
          </div>

          <div className="ledger-btns" id="ledger-btns">
            <div className="" style={{ display: "flex", gap: "5px" }}>
              <select
                style={{ background: "aqua" }}
                onChange={handleFromDateChange}
                value={fromDate || ""}
              >
                <option disabled value="">
                  from date?
                </option>
                {dates.map((date, index) => (
                  <option key={index} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <select
                style={{ background: "aqua" }}
                onChange={handleToDateChange}
                value={toDate || ""}
              >
                <option disabled value="">
                  to date?
                </option>
                {dates.map((date, index) => (
                  <option key={index} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
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
                <td colSpan={5} align="left">
                  <div className="" style={{ display: "flex", gap: "10px" }}>
                    <h3> Total Expenditure : KES {expenditure}</h3>
                    <h3> Total Revenue : KES {revenue}</h3>
                    <h3> Ledger Balance : KES {balance}</h3>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {ledger.length > 0 && (
          <div className="" style={{ display: "flex" }}>
            {fromDate && toDate ? (
              <button
                onClick={() => navigate(`/more/insights/${fromDate}/${toDate}`)}
                style={{
                  border: "2px solid aqua",
                  marginRight: "10px",
                  height: "50px",
                }}
              >
                insights
              </button>
            ) : (
              <button
                onClick={() => navigate(`/more/insights/`)}
                style={{
                  border: "2px solid aqua",
                  marginRight: "10px",
                  height: "50px",
                }}
              >
                insights
              </button>
            )}

            <ReactToPrint
              trigger={() => (
                <button
                  style={{
                    border: "2px solid aqua",
                    marginRight: "10px",
                    height: "50px",
                  }}
                >
                  print
                </button>
              )}
              content={() => componentRef.current}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Ledger;
