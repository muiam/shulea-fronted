import { UserWelcome } from "../menus/CustomMenu";
import LineChart from "../finance/forms/RevenueVsExpenditureChart";
import { getHeadersWithAuth, getPrivateUrl } from "../../app/ApiRequest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Year {
  name: string;
  id: number;
}
function FinanceDashboard() {
  const userDetails = localStorage.getItem("userDetails");
  const user = userDetails ? JSON.parse(userDetails) : null;
  const [monthyFinance, setMonthlyFinance] = useState([]);
  const [yearState, setYearState] = useState<Year[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [totalLedgerBalance, setTotalLedgerBalance] = useState<number>(0);
  const [yearDeductions, setYearDeductions] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    monthlyData();
  }, [selectedYearId]);
  const monthlyData = async () => {
    if (selectedYearId != null) {
      let response = await fetch(
        getPrivateUrl(
          `all/financial/our/school/stats/revenues-expenditure/for/year/${selectedYearId}`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setMonthlyFinance(data.months_data);
      }
    } else {
      let response = await fetch(
        getPrivateUrl(
          `all/financial/our/school/stats/revenues-expenditure/for/year/2024`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setMonthlyFinance(data.months_data);
        setTotalLedgerBalance(data.balance_at_hand);
        setYearDeductions(data.total_deductions);
      }
    }
  };
  useEffect(() => {
    getYear();
  }, []);
  const getYear = async () => {
    let response = await fetch(getPrivateUrl("all/financial/years"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    let data = await response.json();
    setYearState(data);
  };
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYearId = Number(e.target.value);
    setSelectedYearId(selectedYearId);
  };
  const ledger = () => {
    navigate(`/ledger`);
  };
  const fees = () => {
    navigate(`/school-fees`);
  };
  const wallet = () => {
    navigate(`/wallet-balances`);
  };
  const payroll = () => {
    navigate(`/payroll`);
  };
  return (
    <>
      <div className="div-right">
        <UserWelcome
          name={user.firstName + " " + user.lastName || "New User"}
        />
      </div>
      <div className="default-dashboard-stats-container">
        <div
          className="main-dashboard-container"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            className="select-year-here"
            style={{
              alignSelf: "flex-end",
            }}
          >
            <select
              onChange={handleYearChange}
              value={selectedYearId || ""}
              name=""
              id=""
              style={{
                background: "aqua",
                height: "50px",
                marginRight: "10px",
                width: "100px",
                borderRadius: "8px",
              }}
            >
              <option value="" disabled>
                year
              </option>
              {yearState.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <LineChart monthsData={monthyFinance} />
          </div>
        </div>
        <div
          className="minor-dashboard-container"
          style={{ display: "grid", gridAutoColumns: "repeat(2 ,1fr)" }}
        >
          <div
            className=""
            style={{
              background: "aqua",
              borderRadius: "8px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            KES {totalLedgerBalance} AT HAND
          </div>
          <div
            className=""
            style={{
              background: "aqua",
              borderRadius: "8px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            KES {yearDeductions} <br></br> REMITTABLE DEDUCTIONS
          </div>
          <div
            className=""
            style={{
              border: "1px solid aqua",
              borderRadius: "8px",
              marginBottom: "10px",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)", // Two columns
              gap: "5px", // Gap between buttons
              padding: "10px", // Padding inside the div
            }}
          >
            <button
              onClick={ledger}
              style={{ background: "aqua", width: "100%" }}
            >
              LEDGER
            </button>
            <button
              onClick={fees}
              style={{ background: "aqua", width: "100%" }}
            >
              FEES
            </button>
            <button
              onClick={wallet}
              style={{ background: "aqua", width: "100%" }}
            >
              WALLETS
            </button>
            <button
              onClick={payroll}
              style={{ background: "aqua", width: "100%" }}
            >
              PAYROLL
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FinanceDashboard;
