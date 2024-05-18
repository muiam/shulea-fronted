import { ToastContainer, toast } from "react-toastify";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Billed {
  id: number;
  student_name: string;
  student_admission_number: number;
  amount: number;
  total_paid: number;
  payment_date: string;
  level_name: string;
  bill_name: string;
  comment: string;
}
interface Level {
  name: string;
  id: number;
  stream?: string;
}

function BilledList() {
  const [billedData, setBilledData] = useState<Billed[]>([]);
  const params = useParams();
  const [amountsPaid, setAmountsPaid] = useState(
    Array(billedData.length).fill("")
  );
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<number>(0);
  const [grade, setGrade] = useState<Level[]>([]);

  const handleAmountChange = (index: any, value: any) => {
    const newAmountsPaid = [...amountsPaid];
    newAmountsPaid[index] = value;
    setAmountsPaid(newAmountsPaid);
  };
  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGrade = Number(e.target.value);
    setSelectedGrade(selectedGrade);
  };

  useEffect(() => {
    BilledList();
  }, [selectedGrade]);
  useEffect(() => {
    getGrade();
  }, []);
  const getGrade = async () => {
    let response = await fetch(getPrivateUrl("actions/levels"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    if (response.status == 200) {
      let data = await response.json();
      setGrade(data);
    }
  };
  const BilledList = async () => {
    let apiUrl = selectedGrade
      ? `all/financials/our/school/students/billed/${params.billId}/${selectedGrade}`
      : `all/financials/our/school/students/billed/${params.billId}`;

    let response = await fetch(getPrivateUrl(apiUrl), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });

    if (response.status == 200) {
      let data = await response.json();
      setBilledData(data);
    } else if (response.status == 404) {
      toast.error("no billed students found");
    } else {
      toast.error("there was an error");
    }
  };

  const handleBillReceipt = async (
    studentAdmission: number,
    amountPaid: number,
    billedId: number
  ) => {
    console.log(studentAdmission, amountPaid, billedId);
    let response = await fetch(
      getPrivateUrl(
        `all/financials/our/school/students/pay/bills/${billedId}/${studentAdmission}/${amountPaid}`
      ),
      {
        method: "POST",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 201) {
      toast.success("receipt accepted");
      setAmountsPaid(Array(billedData.length).fill(""));
      const updatedBilledData = [...billedData];
      const studentIndex = updatedBilledData.findIndex(
        (item) => item.student_admission_number === studentAdmission
      );
      updatedBilledData[studentIndex].total_paid += Number(amountPaid);
      const isPaid =
        updatedBilledData[studentIndex].total_paid >=
        updatedBilledData[studentIndex].amount;

      // Update the billedData state
      setBilledData(updatedBilledData);

      // If the student has paid in full, filter them out from the list
      if (isPaid) {
        setBilledData((prevBilledData) =>
          prevBilledData.filter(
            (item) => item.student_admission_number !== studentAdmission
          )
        );
      }
    } else {
      toast.error("receipt failed");
      setAmountsPaid(Array(billedData.length).fill(""));
    }
  };
  return (
    <>
      <MainNavbar />
      <ToastContainer />
      <div className="app-content-start">
        <div
          id="new-fee-item"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <div className="filter-year" style={{ flex: 4 }} id="filter-by-year">
            <select
              style={{
                padding: "15px",
                background: "aqua",
                marginLeft: "10px",
              }}
              onChange={handleGradeChange}
            >
              <option value="" disabled>
                grade
              </option>
              {grade.map((item) => (
                <option value={item.id}>
                  grade {item.stream ? item.name + item.stream : item.name}
                </option>
              ))}
            </select>
          </div>
          <div
            className="new-fee-btn"
            style={{ background: "aqua", flex: 1, marginRight: "10px" }}
          >
            <button
              onClick={() => navigate(`/bill/students/${params.billId}/`)}
            >
              Bill student
            </button>
          </div>
        </div>
        <div style={{ marginRight: "10px" }}>
          <table className="default-table">
            <tbody>
              <tr>
                <th>#</th>
                <th>Bill</th>
                <th>Student</th>
                <th>Adm/Nemis no</th>
                <th>current Grade</th>
                <th>comment</th>
                <th>Amount</th>
                <th>Total paid</th>
                <th>Receipt</th>
              </tr>
              {billedData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.bill_name}</td>
                  <td>{item.student_name}</td>
                  <td>{item.student_admission_number}</td>
                  <td>grade {item.level_name} </td>
                  <td>{item.comment}</td>
                  <td>KES {item.amount}</td>
                  <td>KES {item.total_paid}</td>

                  <td>
                    <div
                      className=""
                      style={{
                        display: "flex",
                        padding: "10px",
                        gap: "5px",
                      }}
                    >
                      <input
                        value={amountsPaid[index] || ""}
                        onChange={(e) =>
                          handleAmountChange(index, e.target.value)
                        }
                        type="number"
                        placeholder="amount"
                        style={{ height: "100%", width: "50%" }}
                      />
                      <button
                        style={{
                          marginTop: 0,
                          width: "50%",
                          padding: "18px",
                          background: "aqua",
                        }}
                        onClick={() =>
                          handleBillReceipt(
                            item.student_admission_number,
                            amountsPaid[index],
                            item.id
                          )
                        }
                      >
                        Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default BilledList;
