import { ToastContainer, toast } from "react-toastify";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { SyntheticEvent, useEffect, useState } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";

function BillStudentForm() {
  const [target, setTarget] = useState<string>("all"); // Initial state with 'all' selected
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    []
  );
  const [message, setMessage] = useState("");
  const [selectedMember, setSelectedMember] = useState<number>(0);
  const [billAmount, setBillAmount] = useState<number>(0);
  const [isChecked, setIsChecked] = useState(false);
  const params = useParams();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    if (!event.target.checked) {
      setBillAmount(billAmount);
    }
  };
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTarget(event.target.value);
  };

  useEffect(() => {
    fetchBillAmount();
  }, [params.billId]);
  const fetchBillAmount = async () => {
    const response = await fetch(
      getPrivateUrl(`all/financials/our/school/bills/${params.billId}`),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 200) {
      let data = await response.json();
      setBillAmount(data.amount);
    }
  };

  useEffect(() => {
    staff();
  }, []);
  const staff = async () => {
    let response = await fetch(getPrivateUrl(`actions/student/all`), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    if (response.status == 200) {
      let data = await response.json();
      const newOptions = data.map(
        (student: { id: number; name: string; admission_number: number }) => ({
          label: `${student.admission_number} ${student.name}`,
          value: student.id,
        })
      );
      setOptions(newOptions);
    }
  };

  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption) {
      const selectedUser = selectedOption as { label: string; value: number };
      setSelectedMember(selectedUser.value);
    } else {
      setSelectedMember;
      ("");
      setMessage("");
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    let response = await fetch(
      getPrivateUrl(
        `all/financials/our/school/students/billed/${target}/${params.billId}/`
      ),
      {
        method: "POST",
        headers: getHeadersWithAuth(),
        body: JSON.stringify({
          message: message,
          student: selectedMember,
          amount: billAmount,
        }),
      }
    );
    if (response.status == 201) {
      toast.success("billed successfully");
    } else {
      toast.error("Not billed, an error occurred");
    }
  };
  return (
    <>
      <MainNavbar />
      <ToastContainer />

      <div className="app-content-start">
        <div
          className="new-notification"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <form action="" onSubmit={handleSubmit}>
            <div className="" style={{ display: "flex", gap: "10px" }}>
              <input
                type="radio"
                value="all"
                name="target"
                checked={target == "all"}
                onChange={handleRadioChange}
              />
              <label htmlFor="target" className="input-radio-label">
                All{" "}
              </label>
              <input
                type="radio"
                value="single"
                name="target"
                checked={target == "single"}
                onChange={handleRadioChange}
              />

              <label htmlFor="target">Individual</label>
            </div>
            <div
              className=""
              style={{ display: "flex", flexDirection: "column" }}
            >
              {target == "single" && (
                <Select
                  value={
                    options.find((option) => option.value === selectedMember) ||
                    ""
                  }
                  onChange={handleSelectChange}
                  options={options}
                  isSearchable={true}
                  isClearable={true}
                />
              )}
              <div className="" style={{ display: "flex", gap: "10px" }}>
                <input
                  type="checkbox"
                  name="amount-source"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="amount-source">custom amount</label>
              </div>
              {isChecked ? (
                <input
                  type="number"
                  name="title"
                  placeholder="amount"
                  value={billAmount || ""}
                  onChange={(e) => {
                    const newValue: number | null = parseFloat(e.target.value);
                    if (!isNaN(newValue)) {
                      setBillAmount(newValue);
                    } else {
                      setBillAmount(null as any); // Handle case when newValue is null or NaN
                    }
                  }}
                  style={{
                    border: "1px solid aqua",
                    height: "40px",
                    marginTop: "10px",
                    background: "white",
                    borderRadius: "5px",
                  }}
                />
              ) : (
                <p>Bill applying bill amount of KES {billAmount}</p>
              )}
              <textarea
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                cols={1}
                style={{
                  width: "300px",
                  height: "50px",
                  border: "1px solid aqua",
                  marginTop: "10px",
                }}
                placeholder="a comment (optional)"
              ></textarea>
            </div>
            <div className="" style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                style={{ background: "aqua", width: "100px", height: "50px" }}
              >
                Bill
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default BillStudentForm;
