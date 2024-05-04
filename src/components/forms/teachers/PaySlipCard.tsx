import { useParams } from "react-router-dom";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { useEffect, useRef, useState } from "react";
import { ReactToPrint } from "react-to-print";

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
  social_security: number;
  health_insurance: number;
  other_deductions: number;
  affordable_housing: number;
  advance_salary: number;
  paid: boolean;
  last_name: string;
  first_name: string;
  total_allowances: number;
  tax: number;
  description: string;
  // Add other properties as needed
}

function PayslipCard({}) {
  const params = useParams<{ id: string }>();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const componentRef = useRef(null);

  useEffect(() => {
    fetchPayslipData();
  }, []);

  const fetchPayslipData = async () => {
    try {
      const response = await fetch(
        getPrivateUrl(`all/financial/my/payslip/${params.id}`),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setPayslips(data);
      } else {
        console.error("Failed to fetch payslip data");
      }
    } catch (error) {
      console.error("Error fetching payslip data:", error);
    }
  };

  return (
    <>
      <MainNavbar />
      <div
        className="app-content-start"
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>
          {payslips.map((item, index) => (
            <div
              ref={componentRef}
              className="payslip-container-main-one"
              id="payslip-container-main-one"
              key={index}
            >
              <div
                className="header"
                id="header"
                style={{ display: "flex", borderBottom: "1px solid aqua" }}
              >
                <h1>Payslip</h1>
                {item.paid ? (
                  <span style={{ color: "green" }}>paid</span>
                ) : (
                  <span style={{ color: "red" }}>unpaid</span>
                )}
              </div>
              {item.description && (
                <div className="">
                  <div className="section-title" id="section-title">
                    Description
                  </div>
                  <div className="description-section">
                    <p>
                      This payslip provides a detailed breakdown of your
                      earnings and deductions for the pay period ending April
                      2024. It includes your basic salary, overtime pay,
                      bonuses, income tax, health insurance, retirement fund
                      contributions, and your net pay. Please review all details
                      carefully.
                    </p>
                  </div>
                </div>
              )}

              <div className="section-title">Employee Details</div>
              <div className="details" id="details">
                <div className="detail-item">
                  Name: {item.first_name + " " + item.last_name}
                </div>
                <div className="detail-item">
                  Employee ID: {item.employeeID}
                </div>
                <div className="detail-item">
                  period: {item.month_name + " " + item.year_name}
                </div>
              </div>
              <div className="section-title">Earnings</div>
              <div className="earnings" id="earnings">
                <div className="earning-item">
                  Basic Salary: KES {item.gross_salary}
                </div>
                <div className="earning-item">
                  Total Allowances : KES {item.total_allowances}
                </div>
              </div>
              <div className="section-title">Deductions</div>
              <div className="deductions" id="deductions">
                <div className="deduction-item">Tax: KES {item.tax}</div>
                <div className="deduction-item">
                  Health Insurance: KES: {item.health_insurance}
                </div>
                <div className="deduction-item">
                  NSSF : KES {item.social_security}
                </div>
                <div className="deduction-item">
                  Affordable housing: KES {item.affordable_housing}
                </div>
                <div className="deduction-item">
                  Advance salary: KES: {item.advance_salary}
                </div>
                <div className="deduction-item">
                  Other deductions : KES {item.other_deductions}
                </div>
                <div className="deduction-item">
                  Total deductions : KES {item.total_deductions}
                </div>
              </div>
              <div className="section-title">Take home</div>
              <div className="net-pay">
                <div className="net-item">Take home: KES {item.net_salary}</div>
              </div>
            </div>
          ))}
          {payslips.length > 0 && (
            <ReactToPrint
              trigger={() => (
                <button
                  style={{
                    background: "aqua",
                    width: "150px",
                    height: "40px",
                    marginBottom: "20px",
                    float: "right",
                  }}
                >
                  print payslip
                </button>
              )}
              content={() => componentRef.current}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default PayslipCard;
