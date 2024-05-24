import { useEffect, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

interface Student {
  id: number;
  name: string;
  admission_number: number;
}

interface FeePayment {
  id: number;
  receipt_number: string;
  date: string;
  amount_paid: number;
  fowarded: number;
}
function FeeStatements() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);
  const [feePayment, setFeePayment] = useState<FeePayment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [required, setRequired] = useState<number>(0);

  const params = useParams();

  useEffect(() => {
    const getStudents = async () => {
      let response = await fetch(
        getPrivateUrl(`actions/my/student/level/${params.grade}`),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status === 200) {
        let data = await response.json();
        setStudents(data);
        if (data.length === 1) {
          setSelectedStudentId(data[0].id);
        }
      }
    };
    getStudents();
  }, []);

  useEffect(() => {
    if (selectedStudentId !== 0) {
      FetchStatements();
    }
  }, [selectedStudentId]);
  const FetchStatements = async () => {
    let response = await fetch(
      getPrivateUrl(
        `all/financial/mykid/fee/statements/${params.year}/${params.term}/${params.fee}/${params.grade}/${selectedStudentId}`
      ),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 200) {
      let data = await response.json();
      setFeePayment(data.payments);
      setTotal(data.total);
      setBalance(data.balance);
      setRequired(data.required);
      // toast.success("statements ready for this learner");
    } else {
      toast.error(
        "there was an error in this query. Contact your school or support center"
      );
    }
  };
  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div className="add-start-new">
          <div className="grade-toggle" id="toggle-grade-for-results-zone">
            <label htmlFor="grade">student</label>
            <select
              disabled={students.length == 1}
              name="students"
              className="change-grade"
              value={selectedStudentId || ""}
              onChange={(e) => {
                setSelectedStudentId(Number(e.target.value));
              }}
            >
              <option value="" disabled>
                student
              </option>
              {students.map((student) => (
                <option value={student.id} key={student.id}>
                  {student.admission_number} - {student.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <table className="default-table">
              <tbody>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Receipt No</th>
                  <th>Amount</th>
                  <th>Fowarded</th>
                </tr>
                {feePayment.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.date}</td>
                    <td>{item.receipt_number}</td>
                    <td>KES {item.amount_paid}</td>
                    <td>KES {item.fowarded}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} align="right">
                    <strong>Totals:</strong>
                  </td>
                  <td>
                    <strong>KES {total}</strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} align="right">
                    <strong>Required:</strong>
                  </td>
                  <td>
                    <strong>KES {required}</strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} align="right">
                    <strong>Balance:</strong>
                  </td>
                  <td>
                    <strong>KES {balance}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="learner-wallet-balance"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeeStatements;
