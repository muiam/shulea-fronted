import { useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../app/ApiRequest";
import MainNavbar from "../menus/MainNavbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

interface Year {
  name: string;
  id: number;
}
interface Month {
  name: string;
  id: number;
}
interface PayrollItem {
  id: number;
  gross_salary: number;
  net_salary: number;
  total_deductions: number;
  employeeID: string;
  date: string;
  month_name: string;
  year_name: string;
  employee: string;
  paid: boolean;
  // Add other properties as needed
}

interface PayRollTotals {
  total_gross_salary: number;
  total_net_salary: number;
  total_deductions: number;
}

function PayRoll() {
  const [yearState, setYearState] = useState<Year[]>([]);
  const [monthState, setMonthState] = useState<Month[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [selectedMonthId, setSelectedMonthId] = useState<number | null>(null);
  const [payrolls, setPayrolls] = useState<PayrollItem[]>([]);
  const [payRollTotals, setPayRollTotals] = useState<PayRollTotals>({
    total_gross_salary: 0,
    total_net_salary: 0,
    total_deductions: 0,
  });
  const navigate = useNavigate();

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYearId = Number(e.target.value);
    setSelectedYearId(selectedYearId);
  };
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonthId = Number(e.target.value);
    setSelectedMonthId(selectedMonthId);
  };

  const getYear = async () => {
    let response = await fetch(getPrivateUrl("all/financial/years"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    let data = await response.json();
    setYearState(data);
  };
  const getMonth = async () => {
    let response = await fetch(getPrivateUrl("all/financial/months"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    if (response.status == 200) {
      let data = await response.json();
      setMonthState(data);
    } else {
      toast.error("there was an error");
    }
  };

  useEffect(() => {
    getYear();
    getMonth();
  }, []);

  useEffect(() => {
    getPayroll();
  }, [selectedMonthId, selectedYearId]);

  const getPayroll = async () => {
    if (selectedYearId != null && selectedMonthId != null) {
      console.log(selectedMonthId, selectedYearId);
      let response = await fetch(
        getPrivateUrl(
          `all/financial/payrolls/${selectedYearId}/${selectedMonthId}`
        ),
        {
          headers: getHeadersWithAuth(),
          method: "GET",
        }
      );
      console.log(response.status);
      if (response.status == 200) {
        let data = await response.json();
        setPayrolls(data.payrolls);
        setPayRollTotals(data.totals);
      } else {
        toast.error("error encountered");
      }
    } else {
      setPayrolls([]);
      setPayRollTotals({
        total_gross_salary: 0,
        total_net_salary: 0,
        total_deductions: 0,
      });
    }
  };
  const updatePaid = async (id: number) => {
    const response = await fetch(
      getPrivateUrl(`actions/pay/payslip/?id=${id}`),
      {
        method: "PUT",
        headers: getHeadersWithAuth(),
      }
    );

    if (response.status == 200) {
      toast.success("updated as paid");
      setPayrolls((prevPayroll) =>
        prevPayroll.map((payroll) =>
          payroll.id === id ? { ...payroll, paid: true } : payroll
        )
      );
    } else {
      toast.error("Failed to update as paid");
    }
  };
  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div className="add-new" id="new-payroll-entries-zone">
          <select
            onChange={handleYearChange}
            value={selectedYearId || ""}
            className="select-items-for-payroll"
          >
            <option value="" disabled>
              Year
            </option>
            {yearState.map((year, index) => (
              <option key={index} value={year.id}>
                {year.name}
              </option>
            ))}
          </select>

          <select
            onChange={handleMonthChange}
            value={selectedMonthId || ""}
            className="select-items-for-payroll"
          >
            <option value="" disabled>
              Month
            </option>
            {monthState.map((month, index) => (
              <option key={index} value={month.id}>
                {month.name}
              </option>
            ))}
          </select>

          <div className="select-items-for-payroll">
            <button
              onClick={() => {
                navigate("/new-payslip");
              }}
            >
              New
            </button>
          </div>
        </div>

        <div className="payroll-table" style={{ marginRight: "10px" }}>
          <table>
            <tbody>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>month</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Gross salary</th>
                <th>Total deductions</th>
                <th>Take home</th>
                <th>Paid?</th>
              </tr>
              {payrolls.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>
                    {item.month_name} {item.year_name}
                  </td>
                  <td>{item.employeeID}</td>
                  <td>{item.employee}</td>
                  <td>KES {item.gross_salary}</td>
                  <td>KES {item.total_deductions}</td>
                  <td>KES {item.net_salary}</td>
                  <td>
                    {item.paid ? (
                      <button
                        disabled
                        style={{
                          width: "100%",
                          opacity: "0.4",
                          background: "aqua",
                          cursor: "not-allowed",
                          height: "40px",
                        }}
                      >
                        pay
                      </button>
                    ) : (
                      <button
                        style={{
                          width: "100%",
                          background: "aqua",
                          height: "40px",
                        }}
                        onClick={() => updatePaid(item.id)}
                      >
                        paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={5} align="right">
                  <strong>Totals:</strong>
                </td>
                <td>
                  <strong>KES {payRollTotals.total_gross_salary}</strong>
                </td>
                <td>
                  <strong>KES {payRollTotals.total_deductions}</strong>
                </td>
                <td>
                  <strong>KES {payRollTotals.total_net_salary}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
          Update payslip as paid only when the amount is disbursed to the
          employee's bank account
        </p>
      </div>
    </>
  );
}

export default PayRoll;
