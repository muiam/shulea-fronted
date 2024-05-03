import { useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

interface AcademicYear {
  name: string;
  id: number;
}
interface Term {
  name: string;
  id: number;
}
interface Level {
  name: string;
  id: number;
  stream?: string;
}
interface Fee {
  academic_year: number;
  academic_year_name: string;
  amount: number;
  id: number;
  level: number;
  level_name: string;
  school: number;
  term: number;
  term_name: string;
}

function MyKidsFees() {
  const [academicYear, setAcademicYears] = useState<AcademicYear[]>([]);
  const [grade, setGrade] = useState<Level[]>([]);
  const [term, setTerm] = useState<Term[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<number>(0);
  const [selectedAcademicYearId, setAcademicYearId] = useState<number>(0);
  const [selectedGrade, setSelectedGrade] = useState<number>(0);
  const [fee, setFee] = useState<Fee[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    getAcademicYear();
    getGrade();
  }, []);

  useEffect(() => {
    getTerm();
  }, [selectedAcademicYearId]);

  useEffect(() => {
    allFee();
  }, [selectedAcademicYearId, selectedTermId, selectedGrade]);
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
  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGrade = Number(e.target.value);
    setSelectedGrade(selectedGrade);
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

  const allFee = async () => {
    if (selectedAcademicYearId && selectedTermId && selectedGrade) {
      let response = await fetch(
        getPrivateUrl(
          `all/financial/our/school/fee/${selectedAcademicYearId}/${selectedTermId}/${selectedGrade}/`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        // toast.success("fetch successful");
        let data = await response.json();
        setFee(data);
      } else {
        toast.error("process failed");
      }
    } else if (selectedAcademicYearId && selectedTermId) {
      let response = await fetch(
        getPrivateUrl(
          `all/financial/our/school/fee/${selectedAcademicYearId}/${selectedTermId}/`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        // toast.success("fetch successful");
        let data = await response.json();
        setFee(data);
      } else {
        toast.error("process failed");
      }
    } else if (selectedAcademicYearId) {
      let response = await fetch(
        getPrivateUrl(`all/financial/our/school/fee/${selectedAcademicYearId}`),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        // toast.success("fetch successful");
        let data = await response.json();
        setFee(data);
      } else {
        toast.error("process failed");
      }
    } else {
      let response = await fetch(
        getPrivateUrl(`all/financial/our/school/fee`),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setFee(data);
      } else {
        toast.error("process failed");
      }
    }
  };

  const handleFeeRecipt = (
    year: number,
    term: number,
    grade: number,
    fee: number
  ) => {
    navigate(`/fee-statements/${year}/${term}/${fee}/${grade}`);
  };

  return (
    <>
      <ToastContainer />
      <MainNavbar />
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
              value={selectedAcademicYearId || ""}
              style={{
                padding: "15px",
                background: "aqua",
                marginLeft: "10px",
              }}
              onChange={handleAcademicYearChange}
            >
              <option value={""} disabled>
                year
              </option>
              {academicYear.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              style={{
                padding: "15px",
                background: "aqua",
                marginLeft: "10px",
              }}
              onChange={handleTermChange}
              value={selectedTermId || ""}
            >
              <option value={""} disabled>
                term
              </option>
              {term.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              style={{
                padding: "15px",
                background: "aqua",
                marginLeft: "10px",
              }}
              onChange={handleGradeChange}
              value={selectedGrade || ""}
            >
              <option>grade</option>
              {grade.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.stream ? item.name + item.stream : item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginRight: "10px" }}>
          <table className="default-table">
            <tbody>
              <tr>
                <th>Academic year</th>
                <th>Term</th>
                <th>Grade</th>
                <th>Amount</th>
                <th>Statements</th>
              </tr>
              {fee.map((item, index) => (
                <tr key={index}>
                  <td>{item.academic_year_name}</td>
                  <td>{item.term_name}</td>
                  <td>Grade {item.level_name}</td>
                  <td>KES {item.amount}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleFeeRecipt(
                          item.academic_year,
                          item.term,
                          item.level,
                          item.id
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "20px",
                        background: "aqua",
                      }}
                    >
                      view
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

export default MyKidsFees;
