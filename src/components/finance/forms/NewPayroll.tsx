import { useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

interface Employee {
  email: string;
  employee_id: number;
  first_name: string;
  last_name: string;
  gross_salary: number;
}
interface Year {
  name: string;
  id: number;
}
interface Month {
  name: string;
  id: number;
}
function NewPayroll() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedEmployeeData, setSelectedEmployeeData] =
    useState<Employee | null>(null);
  const [year, setYearState] = useState<Year[]>([]);
  const [month, setMonthState] = useState<Month[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [selectedMonthId, setSelectedMonthId] = useState<number | null>(null);
  const [tax, setTax] = useState<number>(0);
  const [housing, setHousing] = useState<number>(0);
  const [health, setHealth] = useState<number>(0);
  const [nssf, setNssf] = useState<number>(0);
  const [advance, setAdvance] = useState<number>(0);
  const [other, setOther] = useState<number>(0);
  const [allowances, setAllowances] = useState<number>(0);

  useEffect(() => {
    getEmployee();
    getYear();
    getMonth();
  }, []);

  useEffect(() => {
    employeeData();
  }, [selectedEmployee]);

  const getYear = async () => {
    let response = await fetch(getPrivateUrl("all/financial/years"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    let data = await response.json();
    setYearState(data);
  };
  const getMonth = async () => {
    let response = await fetch(getPrivateUrl("all/financial/months"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    let data = await response.json();
    setMonthState(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmployee = String(e.target.value);
    setSelectedEmployee(selectedEmployee);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYearId = Number(e.target.value);
    setSelectedYearId(selectedYearId);
  };
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonthId = Number(e.target.value);
    setSelectedMonthId(selectedMonthId);
  };

  const getEmployee = async () => {
    let response = await fetch(getPrivateUrl("all/financial/employees"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    if (response.status == 200) {
      const data = await response.json();
      setEmployee(data);
    }
  };
  const employeeData = async () => {
    if (selectedEmployee != null) {
      let response = await fetch(
        getPrivateUrl(`all/financial/employees/${selectedEmployee}`),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        const data = await response.json();
        const employee = data.find(
          (emp: { email: string }) => emp.email === selectedEmployee
        );
        setSelectedEmployeeData(employee);
      }
    }
  };
  const saveData = async () => {
    if (selectedEmployeeData?.gross_salary != 0 || allowances != 0) {
      let response = await fetch(getPrivateUrl("all/financial/payrolls/new"), {
        method: "POST",
        headers: getHeadersWithAuth(),
        body: JSON.stringify({
          employee: selectedEmployee,
          employeeID: selectedEmployeeData?.employee_id,
          year: selectedYearId,
          month: selectedMonthId,
          gross_salary:
            selectedEmployeeData?.gross_salary == 0
              ? 0
              : selectedEmployeeData?.gross_salary,
          tax: tax,
          total_allowances: allowances == 0 ? 0 : allowances,
          social_security: nssf,
          health_insurance: health,
          other_deductions: other,
          affordable_housing: housing,
          advance_salary: advance,
        }),
      });
      if (response.status == 201) {
        toast.success("created successfully");
        navigate("/payroll");
        //created
      } else if (response.status == 400) {
        toast.error("employee payslip already entered");
      } else {
        toast.error("an error ocurred. Contact your school or support center");
      }
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
                name="employee"
                id=""
                onChange={handleChange}
                value={selectedEmployee || ""}
              >
                <option value="" disabled>
                  employee
                </option>
                {employee.map((employee, index) => (
                  <option key={index} value={employee.email}>
                    {employee.email} - {employee.first_name}{" "}
                    {employee.last_name}
                  </option>
                ))}
              </select>

              <select
                name="year"
                id=""
                onChange={handleYearChange}
                value={selectedYearId || ""}
              >
                <option value="" disabled>
                  year
                </option>
                {year.map((item, index) => (
                  <option value={item.id} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
              <select
                name="month"
                id=""
                onChange={handleMonthChange}
                value={selectedMonthId || ""}
              >
                <option value="" disabled>
                  month
                </option>
                {month.map((item, index) => (
                  <option value={item.id} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="employeeId"
                readOnly
                value={selectedEmployeeData?.employee_id || ""}
              />
              <input
                type="text"
                name="employee_name"
                placeholder="employee name"
                readOnly
                value={
                  (selectedEmployeeData?.first_name || "") +
                  " " +
                  (selectedEmployeeData?.last_name || "")
                }
              />
              {selectedEmployeeData?.gross_salary == 0 ? (
                <input
                  type="number"
                  name="allowances"
                  value={allowances || ""}
                  placeholder="allowances needed"
                  onChange={(e) => {
                    const newValue: number | null = parseFloat(e.target.value);
                    if (!isNaN(newValue)) {
                      setAllowances(newValue);
                    } else {
                      setAllowances(null as any); // Handle case when newValue is null or NaN
                    }
                  }}
                />
              ) : (
                <input
                  type="number"
                  readOnly
                  name="gross"
                  value={selectedEmployeeData?.gross_salary || 0}
                  placeholder="Gross/Basic salary"
                />
              )}

              <input
                type="number"
                name="tax"
                placeholder="any tax eg PAYE ?"
                value={tax || ""}
                onChange={(e) => {
                  const newValue: number | null = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    setTax(newValue);
                  } else {
                    setTax(null as any); // Handle case when newValue is null or NaN
                  }
                }}
              />

              <input
                type="number"
                name="health"
                placeholder="health insurance?"
                value={health || ""}
                onChange={(e) => {
                  const newValue: number | null = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    setHealth(newValue);
                  } else {
                    setHealth(null as any); // Handle case when newValue is null or NaN
                  }
                }}
              />
              <input
                type="number"
                name="nssf"
                placeholder="NSSF?"
                value={nssf || ""}
                onChange={(e) => {
                  const newValue: number | null = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    setNssf(newValue);
                  } else {
                    setNssf(null as any); // Handle case when newValue is null or NaN
                  }
                }}
              />
              <input
                value={housing || ""}
                onChange={(e) => {
                  const newValue: number | null = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    setHousing(newValue);
                  } else {
                    setHousing(null as any); // Handle case when newValue is null or NaN
                  }
                }}
                type="number"
                name="housing"
                placeholder="affordable housing?"
              />
              <input
                type="number"
                name="advance"
                placeholder="Advance ?"
                value={advance || ""}
                onChange={(e) => {
                  const newValue: number | null = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    setAdvance(newValue);
                  } else {
                    setAdvance(null as any); // Handle case when newValue is null or NaN
                  }
                }}
              />
              <input
                type="number"
                name="other"
                placeholder="any other ?"
                value={other || ""}
                onChange={(e) => {
                  const newValue: number | null = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    setOther(newValue);
                  } else {
                    setOther(null as any); // Handle case when newValue is null or NaN
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
            {selectedEmployee !== null &&
            selectedMonthId !== null &&
            selectedYearId !== null ? (
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
            ) : (
              <button
                disabled
                onClick={() => saveData()}
                style={{
                  cursor: "progress",
                  opacity: "0.6",
                  background: "aqua",
                  width: "200px",
                  padding: "15px",
                }}
              >
                save
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NewPayroll;
