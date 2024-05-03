import { useEffect, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

function NewSchoolFee() {
  const [academicYear, setAcademicYears] = useState<AcademicYear[]>([]);
  const [grade, setGrade] = useState<Level[]>([]);
  const [term, setTerm] = useState<Term[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<number>(0);
  const [selectedAcademicYearId, setAcademicYearId] = useState<number>(0);
  const [selectedGrade, setSelectedGrade] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const navigate = useNavigate();
  //handle changes

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

  useEffect(() => {
    getAcademicYear();
    getGrade();
  }, []);

  useEffect(() => {
    getTerm();
  }, [selectedAcademicYearId]);

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

  const saveData = async () => {
    let response = await fetch(
      getPrivateUrl(`all/financial/our/school/save/new/fee`),
      {
        method: "POST",
        headers: getHeadersWithAuth(),
        body: JSON.stringify({
          level: selectedGrade,
          term: selectedTermId,
          academic_year: selectedAcademicYearId,
          amount: amount,
        }),
      }
    );
    if (response.status == 201) {
      toast.success("new fee item added for your school in given creteria");
      navigate(`/school-fees`);
    } else if (response.status == 500) {
      toast.error(
        "fee payable can only be one for each grade/level/term and academic year"
      );
    } else {
      toast.error("this process failed. Contact your school or support");
    }
  };
  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div
          className="new-payroll-grid"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form action="">
            <div className="form-fields-grid">
              <select
                name="year"
                id=""
                onChange={handleAcademicYearChange}
                value={selectedAcademicYearId || ""}
              >
                <option value="" disabled>
                  academic year
                </option>
                {academicYear.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <select
                name="term"
                id=""
                onChange={handleTermChange}
                value={selectedTermId || ""}
              >
                <option value="" disabled>
                  term
                </option>
                {term.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <select
                name="grade"
                id=""
                onChange={handleGradeChange}
                value={selectedGrade || ""}
              >
                <option value="" disabled>
                  grade
                </option>
                {grade.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.stream ? item.name + item.stream : item.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="other"
                placeholder="amount"
                value={amount || ""}
                onChange={(e) => {
                  const newValue: number | null = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    setAmount(newValue);
                  } else {
                    setAmount(null as any); // Handle case when newValue is null or NaN
                  }
                }}
              />
            </div>
          </form>
          <div
            className="save-area"
            style={{
              marginTop: "20px",
              marginRight: "20px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => saveData()}
              style={{
                background: "aqua",
                width: "200px",
                padding: "15px",
              }}
            >
              save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewSchoolFee;
