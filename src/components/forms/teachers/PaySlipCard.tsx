import { useParams } from "react-router-dom";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { useEffect, useState } from "react";

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
  // Add other properties as needed
}

function PayslipCard({}) {
  const params = useParams<{ id: string }>();
  const [payslips, setPayslips] = useState<Payslip[]>([]);

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
        <div
          className="payslip-container"
          style={{
            marginTop: "20px",
            width: "100%",
            maxWidth: "800px",
          }} /* Adjust the maximum width as needed */
        >
          {payslips.length === 0 ? (
            <div style={{ textAlign: "center", color: "red" }}>
              payslip Not available
            </div>
          ) : (
            payslips.map((payslip, index) => (
              <div
                key={index}
                className="payslip-card"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {payslip.month_name} {payslip.year_name}
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      color: "#555",
                    }}
                  >
                    {payslip.paid ? "paid" : "unpaid"}
                  </div>
                  <div style={{ fontSize: "16px", color: "#555" }}>
                    Payment Date: {new Date(payslip.date).toLocaleDateString()}
                  </div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>Employee Name:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        {payslip.first_name} {payslip.last_name}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>Email Address:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        {payslip.employee}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>Employee ID:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        {payslip.employeeID}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>Gross salary:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        KES {payslip.gross_salary}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>All allowances:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        KES {payslip.total_allowances}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>Taxes:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        KES {payslip.total_deductions}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>Health insurance:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        KES {payslip.health_insurance}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>Affordable housing:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        KES {payslip.affordable_housing}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>NSSF:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        KES {payslip.social_security}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>Advance salary:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        KES {payslip.advance_salary}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>Others:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        KES {payslip.other_deductions}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>Total deductions:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        KES {payslip.total_deductions}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>
                        <strong>Take home:</strong>
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        KES {payslip.net_salary}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default PayslipCard;
