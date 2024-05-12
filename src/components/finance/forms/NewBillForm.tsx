import { SyntheticEvent, useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { ToastContainer, toast } from "react-toastify";

interface AcademicYear {
  name: string;
  id: number;
}
interface Term {
  name: string;
  id: number;
}

function NewBillForm() {
  const [academicYear, setAcademicYears] = useState<AcademicYear[]>([]);
  const [term, setTerm] = useState<Term[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<number>(0);
  const [selectedAcademicYearId, setAcademicYearId] = useState<number>(0);
  const [amount, setAmount] = useState<number>();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    getAcademicYear();
  }, []);

  useEffect(() => {
    getTerm();
  }, [selectedAcademicYearId]);

  const handleAcademicYearChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedYearId = Number(e.target.value);
    setAcademicYearId(selectedYearId);
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTermId = Number(e.target.value);
    setSelectedTermId(selectedTermId);
  };
  const getAcademicYear = async () => {
    let response = await fetch(getPrivateUrl("actions/allYears"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    if (response.status == 200) {
      let data = await response.json();
      setAcademicYears(data);
    }
  };
  const getTerm = async () => {
    if (selectedAcademicYearId != 0 || selectedAcademicYearId != null) {
      let response = await fetch(
        getPrivateUrl(`actions/allTerms?year=${selectedAcademicYearId}`),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setTerm(data);
      }
    }
  };
  const handleBillCreation = async (e: SyntheticEvent) => {
    e.preventDefault();
    let response = await fetch(
      getPrivateUrl(`all/financials/our/school/bills/`),
      {
        method: "POST",
        headers: getHeadersWithAuth(),
        body: JSON.stringify({
          academic_year: selectedAcademicYearId,
          term: selectedTermId,
          amount: amount,
          comment: comment,
          name: name,
        }),
      }
    );
    if (response.status == 201) {
      toast.success("created");
    } else if (response.status == 400) {
      toast.error("all bill fields are required");
    } else {
      toast.error("an error occurred");
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
            marginTop: "70px",
          }}
        >
          <form action="">
            <div className="" style={{ display: "flex", gap: "10px" }}></div>
            <div
              className=""
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <select
                style={{ border: "1px solid aqua", padding: "15px" }}
                onChange={handleAcademicYearChange}
                value={selectedAcademicYearId || ""}
              >
                <option>academic year</option>
                {academicYear.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <select
                style={{ border: "1px solid aqua", padding: "15px" }}
                onChange={handleTermChange}
                value={selectedTermId}
              >
                <option>term</option>
                {term.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="eg school bus fees"
                style={{
                  background: "white",
                  border: "1px solid aqua",
                  padding: "15px",
                }}
              />
              <input
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                type="number"
                placeholder="amount"
                style={{ background: "white", border: "1px solid aqua" }}
              />
              <textarea
                cols={1}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
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
                onClick={handleBillCreation}
                type="submit"
                style={{ background: "aqua", width: "100px", height: "50px" }}
              >
                create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewBillForm;
