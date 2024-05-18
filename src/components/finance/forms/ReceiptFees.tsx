import { useParams } from "react-router-dom";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Select, { SingleValue } from "react-select";

interface Student {
  student_id: number;
  student_name: string;
  balance: number;
}
interface OverPay {
  total_unused: number;
}
type SelectOption = {
  value: number;
  label: string;
};

function ReceiptFees() {
  const params = useParams();
  const [student, setStudent] = useState<Student[]>([]);
  const [overPayAmount, setStudentOverPay] = useState<OverPay | 0>(0);
  const [payAmount, SetPayAmount] = useState<number>(0);
  const [receiptNo, setReceiptNo] = useState<number>(0);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  useEffect(() => {
    fetchStudent();
  }, []);
  const fetchStudent = async () => {
    let response = await fetch(
      getPrivateUrl(
        `all/financial/students/fee/unpaid/${params.year}/${params.term}/${params.grade}/${params.fee}/`
      ),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    let data = await response.json();
    setStudent(data.unpaid_students);
  };

  const studentOptions = student.map((student) => ({
    value: student.student_id,
    label: student.student_name,
  }));

  const handleStudentChange = (selectedOption: SingleValue<SelectOption>) => {
    setSelectedStudent(selectedOption ? selectedOption.value : null);
  };

  useEffect(() => {
    fetchStudentOverPay();
  }, [selectedStudent]);
  const fetchStudentOverPay = async () => {
    if (selectedStudent != null) {
      let response = await fetch(
        getPrivateUrl(
          `all/financial/our/school/fee/overpaid/${selectedStudent}`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      let data = await response.json();
      setStudentOverPay(data);
    }
  };

  const receiptFee = async () => {
    if (overPayAmount && overPayAmount.total_unused > 0 && receiptNo) {
      let response = await fetch(
        getPrivateUrl(`all/financial/our/school/receive/fee/overpay/`),
        {
          method: "POST",
          headers: getHeadersWithAuth(),
          body: JSON.stringify({
            student: selectedStudent,
            fee: params.fee,
            amount_paid: overPayAmount.total_unused,
            receipt_number: receiptNo,
            level: params.grade,
            academic_year: params.year,
            term: params.term,
          }),
        }
      );
      if (response.status == 201) {
        window.location.reload();
      } else {
        toast.error("receipt not successful");
        window.location.reload();
      }
    } else {
      let response = await fetch(
        getPrivateUrl(`all/financial/our/school/receive/fee/direct/`),
        {
          method: "POST",
          headers: getHeadersWithAuth(),
          body: JSON.stringify({
            student: selectedStudent,
            fee: params.fee,
            amount_paid: payAmount,
            receipt_number: receiptNo,
            level: params.grade,
            academic_year: params.year,
            term: params.term,
          }),
        }
      );
      if (response.status == 201) {
        toast.success("receipt successful");
        window.location.reload();
      } else {
        toast.error("there was an error in receipting");
        window.location.reload();
      }
    }
  };
  const generateReceiptNo = async () => {
    let response = await fetch(
      getPrivateUrl(`all/financial/our/school/generate/receipt/`),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 200) {
      toast.success("receipt number generated");
      let data = await response.json();
      setReceiptNo(data);
    } else {
      toast.error("receipt number not generated");
    }
  };

  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div className="main-area" id="main-area">
          <div className="carry-foward-area">
            <div className="carry-foward-area">
              <div className="detected-amount">
                <h1>Learner Wallet Balance</h1>
                <div
                  className="amount"
                  style={{
                    background: "aqua",
                    padding: "20px",
                    textAlign: "center",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <h2
                    style={{
                      textAlign: "center",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    {overPayAmount ? (
                      <p>KES {overPayAmount.total_unused}</p>
                    ) : (
                      <p>KES 0</p>
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="student-area">
            <div className="form-container" id="fees-form-container">
              <Select
                className="custom-select"
                classNamePrefix="custom-select__control"
                options={studentOptions}
                isSearchable
                isLoading
                onChange={handleStudentChange}
                placeholder="Select a student"
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    background: "aqua",
                    height: "50px",
                  }),
                }}
              />

              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "100%",
                }}
              >
                <input
                  type="text"
                  value={receiptNo || ""}
                  onChange={(e) => {
                    const newValue: number | null = parseFloat(e.target.value);
                    if (!isNaN(newValue)) {
                      setReceiptNo(newValue);
                    } else {
                      setReceiptNo(null as any); // Handle case when newValue is null or NaN
                    }
                  }}
                  placeholder="Receipt No"
                  style={{
                    padding: "15px",
                    fontSize: "20px",
                    paddingRight: "40px",
                    background: "aqua",
                    width: "100%",
                    borderRadius: "5px",
                  }} // Added paddingRight to accommodate button
                />
                <button
                  onClick={generateReceiptNo}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: "10px",
                    marginRight: "10px",
                    width: "100px",
                    background: "white",
                  }}
                >
                  Generate
                </button>
              </div>

              {overPayAmount && overPayAmount.total_unused > 0 ? (
                <input
                  name=""
                  readOnly
                  type="number"
                  value={overPayAmount.total_unused || ""}
                  placeholder="amount"
                  style={{ marginTop: "20px", fontSize: "20px" }}
                />
              ) : (
                <input
                  name=""
                  type="number"
                  value={payAmount || ""}
                  placeholder="amount"
                  onChange={(e) => {
                    const newValue: number | null = parseFloat(e.target.value);
                    if (!isNaN(newValue)) {
                      SetPayAmount(newValue);
                    } else {
                      SetPayAmount(null as any); // Handle case when newValue is null or NaN
                    }
                  }}
                  style={{ marginTop: "20px", fontSize: "20px" }}
                />
              )}

              {!selectedStudent ? (
                <div style={{ width: "100%" }}>
                  <p>Error: Student not selected</p>
                  <button
                    disabled
                    style={{
                      cursor: "progress",
                      alignSelf: "flex-end",
                      background: "aqua",
                      width: "100%",
                      height: "50px",
                      fontSize: "20px",
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (!receiptNo &&
                  overPayAmount &&
                  overPayAmount.total_unused === 0 &&
                  payAmount === 0) ||
                payAmount === null ? (
                <div>
                  <p>
                    Error: Receipt number not entered and overpay unused is 0
                  </p>
                  <button
                    disabled
                    style={{
                      cursor: "progress",
                      alignSelf: "flex-end",
                      background: "aqua",
                      width: "100px",
                      height: "50px",
                      fontSize: "20px",
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <p>enter amount and proceed to save</p>
                  <button
                    style={{
                      alignSelf: "flex-end",
                      background: "aqua",
                      width: "100px",
                      height: "50px",
                      fontSize: "20px",
                    }}
                    onClick={receiptFee}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReceiptFees;
