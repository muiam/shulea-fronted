import { ToastContainer, toast } from "react-toastify";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";

interface PaymentListItems {
  student_name: string;
  admission_number: number;
  total_paid: number;
  bill: string;
}

function BillPaymentList() {
  const [paymentList, setPaymentList] = useState<PaymentListItems[]>([]);
  const params = useParams();
  const [expected, setExpected] = useState<number>(0);
  const [paidSum, setTotalPaidSum] = useState<number>(0);
  const [percentageSettled, setPercentageSettled] = useState<number>(0);
  const componentRef = useRef(null);
  useEffect(() => {
    getPaymentList();
  }, []);

  const getPaymentList = async () => {
    let response = await fetch(
      getPrivateUrl(
        `all/financials/our/school/students/bill/payment/list/${params.billId}/`
      ),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );

    if (response.status == 200) {
      let data = await response.json();
      setPaymentList(data);
      setExpected(data[data.length - 1].stats.expected_amount);
      setTotalPaidSum(data[data.length - 1].stats.total_paid_sum);
      setPercentageSettled(data[data.length - 1].stats.percentage_settled);
    } else if (response.status == 404) {
      toast.error("no billed students found");
    } else {
      toast.error("there was an error");
    }
  };

  return (
    <>
      <MainNavbar />
      <ToastContainer />
      <div className="app-content-start">
        {paymentList.length > 0 && (
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
                <th>Student</th>
                <th>Adm/Nemis no</th>
                <th>Total paid</th>
              </tr>
              {paymentList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.bill}</td>
                  <td>{item.student_name}</td>
                  <td>{item.admission_number}</td>
                  <td>{item.total_paid}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={4}>
                  <strong>Totals</strong>
                </td>
                <td>
                  <strong>KES {paidSum}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: "10px", marginBottom: "10px" }}>
            This is only {percentageSettled} out of KES {expected} expected
          </p>
          {percentageSettled >= 100 ? (
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
                  width: `${percentageSettled}%`, // Set the width to 100% to prevent overflow
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

export default BillPaymentList;
