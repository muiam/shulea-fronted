import { ToastContainer, toast } from "react-toastify";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Bill {
  id: number;
  name: string;
  comment: string;
  term_name: string;
  academic_year_name: string;
  amount: number;
}
interface AcademicYear {
  name: string;
  id: number;
}
interface Term {
  name: string;
  id: number;
}

function PayableBills() {
  const [bill, setBill] = useState<Bill[]>([]);
  const navigate = useNavigate();
  const [academicYear, setAcademicYears] = useState<AcademicYear[]>([]);
  const [term, setTerm] = useState<Term[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<number>(0);
  const [selectedAcademicYearId, setAcademicYearId] = useState<number>(0);

  useEffect(() => {
    getAcademicYear();
  }, []);

  useEffect(() => {
    getTerm();
  }, [selectedAcademicYearId]);

  useEffect(() => {
    allBills();
  }, [selectedAcademicYearId, selectedTermId]);

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

  const allBills = async () => {
    let apiUrl =
      selectedAcademicYearId && selectedTermId != 0
        ? `all/financials/our/school/bills/${selectedAcademicYearId}/${selectedTermId}`
        : `all/financials/our/school/bills/`;

    try {
      let response = await fetch(getPrivateUrl(apiUrl), {
        method: "GET",
        headers: getHeadersWithAuth(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bills");
      }

      let data = await response.json();
      setBill(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error("Failed to fetch bills. Please try again later.");
    }
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
              onChange={handleAcademicYearChange}
              value={selectedAcademicYearId || ""}
              style={{
                padding: "15px",
                background: "aqua",
                marginLeft: "10px",
              }}
            >
              <option value="" disabled>
                year
              </option>
              {academicYear.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              onChange={handleTermChange}
              value={selectedTermId || ""}
              style={{
                padding: "15px",
                background: "aqua",
                marginLeft: "10px",
              }}
            >
              <option value=" " disabled>
                term
              </option>
              {term.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div
            className="new-fee-btn"
            style={{ background: "aqua", flex: 1, marginRight: "10px" }}
          >
            <button onClick={() => navigate("/billing/new/")}>New</button>
          </div>
        </div>
        <div style={{ marginRight: "10px" }}>
          <table className="default-table">
            <tbody>
              <tr>
                <th>#</th>
                <th>Academic year</th>
                <th>Term</th>
                <th>Bill</th>
                <th>Amount</th>
                <th>Comment</th>
                <th>Payment list</th>
                <th>Billed</th>
                <th>Statements</th>
              </tr>
              {bill.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.academic_year_name}</td>
                  <td>{item.term_name}</td>
                  <td>{item.name}</td>
                  <td>KES {item.amount}</td>
                  <td>{item.comment}</td>
                  <td>
                    <button
                      style={{
                        width: "100%",
                        padding: "20px",
                        background: "aqua",
                      }}
                      onClick={() =>
                        navigate(`/billing/payment-list/${item.id}/`)
                      }
                    >
                      paid list
                    </button>
                  </td>

                  <td>
                    <button
                      style={{
                        width: "100%",
                        padding: "20px",
                        background: "aqua",
                      }}
                      onClick={() => navigate(`/billed/${item.id}/`)}
                    >
                      Billed
                    </button>
                  </td>
                  <td>
                    <button
                      style={{
                        width: "100%",
                        padding: "20px",
                        background: "aqua",
                      }}
                      onClick={() => navigate(`/billed/${item.id}/`)}
                    >
                      statements
                    </button>
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

export default PayableBills;
