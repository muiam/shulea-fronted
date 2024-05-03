import { useEffect, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
interface AcademicYear {
  id: number;
  name: string;
}

interface Exam {
  id: number;
  name: string;
}

interface Term {
  id: number;
  name: string;
}

function KidProgress() {
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [allYear, setAllYear] = useState<AcademicYear[]>([]);
  const [allTerms, setAllTerm] = useState<Term[]>([]);
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(getPrivateUrl("actions/allYears"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    })
      .then((response) => response.json())
      .then((data) => setAllYear(data))
      .catch((error) => console.error("Error fetching levels:", error));
  }, []);

  useEffect(() => {
    if (selectedYearId) {
      fetch(getPrivateUrl(`actions/allTerms?year=${selectedYearId}`), {
        method: "GET",
        headers: getHeadersWithAuth(),
      })
        .then((response) => response.json())
        .then((data) => setAllTerm(data))
        .catch((error) => toast.error("Error fetching terms:", error));
    }
  }, [selectedYearId]);

  useEffect(() => {
    if (selectedYearId && selectedTermId) {
      fetch(
        getPrivateUrl(
          `actions/allExams?year=${selectedYearId}&term=${selectedTermId}`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      )
        .then((response) => response.json())
        .then((data) => setAllExams(data))
        .catch((error) =>
          toast.error(
            "Error fetching exam or exam with this creteria unpublished:",
            error
          )
        );
    }
  }, [selectedYearId, selectedTermId]);

  const examDetails = (
    year: number,
    term: number,
    exam: number,
    examName: string
  ) => {
    navigate("/my/kid/progress-data", {
      state: {
        year,
        term,
        exam,
        examName,
      },
    });
  };

  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div className="add-start-new">
          <h2 className="default-heading">
            set the academic year and term and then select exam{" "}
          </h2>

          <form className="form-container" id="results-add-form">
            <div
              className="form-select-container"
              id="results-add-form-selector"
            >
              <label htmlFor="academic">Academic Year</label>
              <select
                name=""
                id=""
                onChange={(e) => setSelectedYearId(Number(e.target.value))}
                value={selectedYearId || ""}
              >
                <option value="" disabled>
                  select Year
                </option>

                {allYear.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
              <label htmlFor="Term">Term</label>
              <select
                name=""
                id=""
                onChange={(e) => setSelectedTermId(Number(e.target.value))}
                value={selectedTermId || ""}
              >
                <option value="" disabled>
                  select Term
                </option>

                {allTerms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
          <div className="exam-container">
            {allExams.map((exam) => (
              <div
                key={exam.id}
                className="exam-display-item"
                onClick={() => {
                  // Ensure all IDs are not null before calling examDetails
                  if (selectedYearId !== null && selectedTermId !== null) {
                    examDetails(
                      selectedYearId,
                      selectedTermId,
                      exam.id,
                      exam.name
                    );
                  } else {
                    console.error("Year ID or Term ID is null");
                    // You might want to handle this case more gracefully,
                    // perhaps showing a user-facing error message.
                  }
                }}
              >
                <p>{exam.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default KidProgress;
