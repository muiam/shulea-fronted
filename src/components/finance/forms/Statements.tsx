import { useParams } from "react-router-dom";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
interface Statement {
  bill: string;
  student_name: string;
  amount: number;
  receipt_number: string;
  payment_date: string;
  student_admission_number: number;
}

function Statements() {
  const [statements, setStaments] = useState<Statement[]>([]);
  const [total_amount, setTotalAmount] = useState<number>(0);
  const componentRef = useRef(null);
  const params = useParams();
  useEffect(() => {
    fetchStatements();
  }, []);
  const fetchStatements = async () => {
    let response = await fetch(
      getPrivateUrl(
        `all/financials/our/school/students/bill/payment/statements/${params.billId}/`
      ),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 200) {
      let data = await response.json();
      setStaments(data.payments);
      setTotalAmount(data.total_amount_in_statements);
    }
  };
  return (
    <>
      <MainNavbar />
      <div className="app-content-start">
        {statements.length > 0 && (
          <ReactToPrint
            trigger={() => (
              <button
                style={{
                  float: "right",
                  background: "aqua",
                  width: "100px",
                  marginRight: "10px",
                  height: "40px",
                }}
              >
                print
              </button>
            )}
            content={() => componentRef.current}
          />
        )}
        <div style={{ marginRight: "10px" }} ref={componentRef}>
          <table>
            <tbody>
              <tr>
                <th>#</th>
                <th>Bill</th>
                <th>Adm/Nemis no</th>
                <th>student name</th>
                <th>Amount</th>
                <th>Receipt number</th>
                <th>Date</th>
              </tr>
              {statements.map((item, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.bill}</td>
                  <td>{item.student_admission_number}</td>
                  <td>{item.student_name}</td>
                  <td>KES {item.amount}</td>
                  <td>{item.receipt_number}</td>
                  <td>{item.payment_date}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={4}>
                  <strong>Totals </strong>
                </td>
                <td>
                  <strong>KES {total_amount}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Statements;
