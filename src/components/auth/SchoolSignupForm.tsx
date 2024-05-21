import { SyntheticEvent, useState } from "react";
import { getPrivateUrl } from "../../app/ApiRequest";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import countyData from "../../app/Data/CountiesData";
interface Ward {
  label: string;
  value: string;
}

interface Constituency {
  label: string;
  value: string;
  wards: Ward[];
}

interface County {
  label: string;
  value: string;
  constituencies: Constituency[];
}

const SchoolSignupForm = () => {
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [headTeacherName, setheadTeacherName] = useState("");
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedPopulation, setSelectedPopulation] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [selectedConstituency, setSelectedConstituency] =
    useState<Constituency | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: any) => {
    setIsChecked(event.target.checked);
  };
  // Group data by County and Constituency
  const groupedData: { [county: string]: { [constituency: string]: Ward[] } } =
    {};
  countyData.forEach((item, index) => {
    if (index === 0) return; // Skip header row
    if (!groupedData[item.County]) {
      groupedData[item.County] = {};
    }
    if (!groupedData[item.County][item.Constituency]) {
      groupedData[item.County][item.Constituency] = [];
    }
    groupedData[item.County][item.Constituency].push({
      label: item.Ward,
      value: item.Ward,
    });
  });

  // Convert grouped data to the format expected by react-select
  const options: County[] = Object.keys(groupedData).map((county) => ({
    label: county,
    value: county,
    constituencies: Object.keys(groupedData[county]).map((constituency) => ({
      label: constituency,
      value: constituency,
      wards: groupedData[county][constituency],
    })),
  }));

  const handleCountyChange = (selectedOption: any) => {
    setSelectedCounty(selectedOption as County);
    setSelectedConstituency(null);
    setSelectedWard(null);
  };

  const handleConstituencyChange = (selectedOption: any) => {
    setSelectedConstituency(selectedOption as Constituency);
    setSelectedWard(null);
  };

  const handleWardChange = (selectedOption: any) => {
    setSelectedWard(selectedOption as Ward);
  };

  const handleNewStudent = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    let response = await fetch(getPrivateUrl("actions/school"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: schoolName,
        head_teacher: headTeacherName,
        school_email: email,
        population: selectedPopulation,
        curriculum: selectedCurriculum,
        county: selectedCounty?.value,
        constituency: selectedConstituency?.value,
        ward: selectedWard?.value,
        note: note,
      }),
    });
    setLoading(false);
    setheadTeacherName("");
    setSchoolName("");
    setSelectedCounty(null);
    setSelectedConstituency(null);
    setSelectedCurriculum("");
    setSelectedPopulation("");
    setEmail("");

    if (response.status == 201) {
      toast.success(
        "success, we have added your school into our list. We shall get back to you for a demo and onboarding process"
      );
    } else {
      toast.error(
        "unkown error occured. Maybe you are submitting without school name , head techer and school email fields"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="">
        <div className="add-start">
          <h2>Enter your school information</h2>
          <div
            className=""
            style={{ display: "flex", flexDirection: "column" }}
          >
            <form action="" className="new-record-form">
              <div className="add-form">
                <input
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  type="text"
                  placeholder="school name (required)"
                  name="school name"
                  className="add-input"
                />
              </div>
              <div className="add-form">
                <input
                  type="text"
                  value={headTeacherName}
                  onChange={(e) => setheadTeacherName(e.target.value)}
                  placeholder="headteacher name (required)"
                  name="full-name"
                  className="add-input"
                />
              </div>
              <div className="add-form">
                <input
                  style={{
                    width: "100%",
                    textIndent: "10px",
                    background: "aqua",
                    borderRadius: "10px",
                  }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="school email (required)"
                  name="email"
                  className="add-input"
                />
              </div>

              <div className="add-form">
                <select
                  name=""
                  id=""
                  onChange={(e) => setSelectedPopulation(e.target.value)}
                  value={selectedPopulation}
                >
                  <option value="" disabled>
                    select population
                  </option>
                  <option value="0-50">0-50 students</option>
                  <option value="0-50">50-150 students</option>
                  <option value="0-50">150-350 students</option>
                  <option value="0-50">350-500 students</option>
                  <option value="0-50">500-700 students</option>
                  <option value="0-50">700 -1000 students</option>
                  <option value="0-50">1000 - 1500 students</option>
                  <option value="0-50">1500 + students</option>
                </select>
              </div>
              <div className="add-form">
                <select
                  name="curriculum"
                  id=""
                  onChange={(e) => setSelectedCurriculum(e.target.value)}
                  value={selectedCurriculum}
                >
                  <option value="" disabled>
                    select curriculum
                  </option>
                  <option value="CBC">CBC</option>
                  <option value="Cambridge">Cambridge</option>
                  <option value="Edexcel">Edexcel</option>
                  <option value="combo">a combo of more than one above</option>
                </select>
              </div>
              <div className="add-form">
                <Select
                  className="custom-select"
                  classNamePrefix="custom-select__control"
                  value={selectedCounty}
                  onChange={handleCountyChange}
                  options={options}
                  placeholder="Select County"
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      background: "aqua",
                      height: "50px",
                    }),
                  }}
                />
              </div>
              <div className="add-form">
                {selectedCounty && (
                  <Select
                    className="custom-select"
                    classNamePrefix="custom-select__control"
                    value={selectedConstituency}
                    onChange={handleConstituencyChange}
                    options={selectedCounty.constituencies}
                    placeholder="Select Constituency"
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        background: "aqua",
                        height: "50px",
                      }),
                    }}
                  />
                )}
              </div>
              <div className="add-form">
                {selectedConstituency && (
                  <Select
                    className="custom-select"
                    classNamePrefix="custom-select__control"
                    value={selectedWard}
                    onChange={handleWardChange}
                    options={selectedConstituency.wards}
                    placeholder="Select Ward"
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        background: "aqua",
                        height: "50px",
                      }),
                    }}
                  />
                )}{" "}
              </div>
            </form>
            <div className="add-form">
              <textarea
                onChange={(e) => setNote(e.target.value)}
                value={note}
                name=""
                id=""
                rows={1}
                placeholder="any note?"
                style={{ marginBottom: "10px" }}
              ></textarea>
            </div>

            <div
              className=""
              style={{ display: "flex", gap: "10px", marginLeft: "20px" }}
            >
              <input type="checkbox" onChange={handleCheckboxChange} required />{" "}
              <p>I allow shulea to contact me </p>
            </div>
            <div className="">
              {" "}
              <button
                className=""
                disabled={!isChecked}
                style={{
                  background: "aqua",
                  height: "50px",
                  width: "calc(100% - 40px)", // Adjusted width to accommodate the spinner
                  marginRight: "20px",
                  marginLeft: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center", // Center the spinner vertically
                  position: "relative", // Necessary for absolute positioning of the spinner
                  overflow: "hidden",
                }}
                onClick={handleNewStudent}
              >
                {isLoading ? (
                  <div
                    className="loader"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <div className="loading"></div>
                  </div>
                ) : (
                  "save"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolSignupForm;
