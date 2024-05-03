import { useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { useNavigate } from "react-router-dom";

interface Year {
  name: string;
  id: number;
}
interface Payslip {
  id: number;
  gross_salary: number;
  net_salary: number;
  total_deductions: number;
  employeeID: string;
  date: string;
  month_name: string;
  year_name: string;
  employee: string;
  paid: Boolean;
  // Add other properties as needed
}

function MyPaySlips() {
  const navigate = useNavigate();
  const [year, setYearState] = useState<Year[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [payslips, setPaySlipData] = useState<Payslip[]>([]);
  const [paySlipsTotal, setPaySlipsTotal] = useState<number>(0);

  useEffect(() => {
    getYear();
    allPaySlips();
  }, []);

  useEffect(() => {
    allPaySlips();
  }, [selectedYearId]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYearId = Number(e.target.value);
    setSelectedYearId(selectedYearId);
  };

  const getYear = async () => {
    let response = await fetch(getPrivateUrl("all/financial/years"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    let data = await response.json();
    setYearState(data);
  };
  const handlePaySlipDetails = (id: number) => {
    navigate(`/payslip-details/${encodeURIComponent(id || "placeholder")}`);
  };

  const allPaySlips = async () => {
    if (selectedYearId !== null && selectedYearId !== 0) {
      let response = await fetch(
        getPrivateUrl(`all/financial/my/payslips/${selectedYearId}`),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      // Handle response for selected year
      if (response.status == 200) {
        const data = await response.json();
        setPaySlipData(data.payslips);
        setPaySlipsTotal(data.total_net_salary);
      }
    } else {
      let response = await fetch(getPrivateUrl(`all/financial/my/payslips`), {
        method: "GET",
        headers: getHeadersWithAuth(),
      });
      // Handle response for all years
      if (response.status == 200) {
        const data = await response.json();
        setPaySlipData(data.payslips);
        setPaySlipsTotal(data.total_net_salary);
      }
    }
  };

  return (
    <>
      <MainNavbar />
      <div className="app-content-start" style={{ padding: "20px" }}>
        <div className="grade-toggle">
          <label htmlFor="AcademicYear">Change year</label>
          <select
            name="AcademicYear"
            className="change-grade"
            value={selectedYearId || " "}
            onChange={handleYearChange}
          >
            <option value="" disabled>
              Select year
            </option>
            {year.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="intro-div" style={{ display: "flex" }}>
          <div
            className="totals-payslip-div"
            style={{
              display: "flex",
              background: "aqua",
              height: "50px",
              textAlign: "center",
              justifyContent: "center",
              marginTop: "20px",
              alignItems: "center",
              borderRadius: "5px",
            }}
          >
            <h2 style={{ margin: "20px" }}>Total: KES {paySlipsTotal}</h2>
          </div>
        </div>
        <div
          className="payslip-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            height: "100px",
            marginTop: "20px",
          }}
        >
          {payslips.map((payslip) => (
            <div
              className="payslip-card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                position: "relative",
              }}
            >
              <div
                className="payslip-header"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {payslip.month_name} {payslip.year_name}
              </div>
              <div className="payslip-body" style={{ fontSize: "16px" }}>
                <p>Amount: KES {payslip.net_salary}</p>

                {payslip.paid ? ( // Conditional rendering based on the paid property
                  <div
                    className="paid-indicator"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      color: "green", // Green color for paid
                    }}
                  >
                    Paid
                  </div>
                ) : (
                  <div
                    className="paid-indicator"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      color: "red", // Red color for not paid
                    }}
                  >
                    unpaid
                  </div>
                )}
                <div
                  className="view-details"
                  style={{
                    float: "right",
                    cursor: "pointer",
                  }}
                  onClick={() => handlePaySlipDetails(payslip.id)}
                >
                  <i
                    className="fa-solid fa-chevron-right"
                    style={{ color: "aqua" }}
                  ></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MyPaySlips;
