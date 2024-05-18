import { SyntheticEvent, useEffect, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { useNavigate } from "react-router-dom";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import countyData from "../../../app/Data/CountiesData";
interface Level {
  id: number;
  name: string;
  stream?: string;
}
interface Curriculum {
  id: number;
  name: string;
}

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

const AddStudentForm = () => {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [allLevels, setAllLevels] = useState<Level[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [curriculum, setCurriculum] = useState<Curriculum[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<number | null>(
    null
  );
  const navigate = useNavigate();
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [selectedConstituency, setSelectedConstituency] =
    useState<Constituency | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [selectedGender, setselectedGender] = useState("");
  const [parentOptions, setParentOptions] =
    useState<{ label: string; value: number }[]>();
  const [studentParent, setStudentParent] = useState("");
  const [isLoading, setLoading] = useState(false);
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
  const handleStudentSelectChange = (selectedOption: any) => {
    if (selectedOption) {
      const selectedUser = selectedOption as { label: string; value: number };
      setStudentParent(selectedUser.value.toString());
    } else {
      setStudentParent("");
    }
  };

  const handleNewStudent = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    let response = await fetch(getPrivateUrl("actions/student"), {
      method: "POST",
      headers: getHeadersWithAuth(),
      body: JSON.stringify({
        admission_number: admissionNumber,
        name: name,
        parent: studentParent,
        current_level: selectedLevelId,
        curriculum: selectedCurriculum,
        gender: selectedGender,
        county: selectedCounty,
        constituency: selectedConstituency,
        ward: selectedWard,
      }),
    });
    setLoading(false);
    setAdmissionNumber("");
    setName("");
    setSelectedCounty(null);
    setSelectedConstituency(null);
    setSelectedCurriculum(null);
    setStudentParent("");
    if (response.status == 201) {
      toast.success("success, we have enrolled a new student");
    } else if (response.status == 400) {
      toast.error("student  already exists");
    } else if (response.status == 403) {
      toast.error("you have no rights to perform this ");
    } else if (response.status == 401) {
      toast.error("expired token/ authentication");
      localStorage.removeItem("access");
      navigate("/");
    } else if (response.status == 404) {
      toast.error("an api error detected, please contact support");
    } else if (response.status == 500) {
      toast.error("some details may be missing");
    } else {
      toast.error("unkown error occured. Contact support");
      navigate("/");
    }
  };

  useEffect(() => {
    fetch(getPrivateUrl("actions/parent"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    })
      .then((response) => response.json())
      .then((data) => {
        const ParentOptions = data.map(
          (user: {
            id: number;
            email: string;
            first_name: string;
            last_name: string;
          }) => ({
            label: `${user.first_name} ${user.last_name} (${user.email})`,
            value: user.id,
          })
        );
        setParentOptions(ParentOptions);
      })
      .catch((error) => console.error("Error fetching parent names:", error));
  }, []);

  useEffect(() => {
    fetch(getPrivateUrl("app/fetch/curriculum/all"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    })
      .then((response) => response.json())
      .then((data) => {
        setCurriculum(data);
      })
      .catch((error) => console.error("Error fetching :", error));
  }, []);

  useEffect(() => {
    fetch(getPrivateUrl("actions/levels"), {
      method: "GET",
      headers: getHeadersWithAuth(),
    })
      .then((response) => response.json())
      .then((data) => {
        setAllLevels(data); // Assuming data is an array of Level objects
      })
      .catch((error) => console.error("Error fetching levels:", error));
  }, []);

  return (
    <>
      <MainNavbar />
      <ToastContainer />
      <div className="app-content-start">
        <div className="add-start">
          <h2>Proceed to admit a student</h2>
          <div
            className=""
            style={{ display: "flex", flexDirection: "column" }}
          >
            <form action="" className="new-record-form">
              <div className="add-form">
                <input
                  type="text"
                  value={admissionNumber}
                  placeholder="Admission Number"
                  name="admissionNumber"
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  className="add-input"
                />
              </div>
              <div className="add-form">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="full name"
                  name="full-name"
                  className="add-input"
                />
              </div>

              <div className="add-form">
                <Select
                  className="custom-select"
                  classNamePrefix="custom-select__control"
                  options={parentOptions}
                  onChange={handleStudentSelectChange}
                  placeholder="set parent"
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
                <select
                  name=""
                  id=""
                  onChange={(e) => setSelectedLevelId(Number(e.target.value))}
                  value={selectedLevelId || ""}
                >
                  <option value="" disabled>
                    select grade
                  </option>

                  {allLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      grade{" "}
                      {level.stream
                        ? level.name + "" + level.stream
                        : level.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-form">
                <select
                  name="curriculum"
                  id=""
                  onChange={(e) =>
                    setSelectedCurriculum(Number(e.target.value))
                  }
                  value={selectedCurriculum || ""}
                >
                  <option value="" disabled>
                    select curriculum
                  </option>

                  {curriculum.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-form">
                <select
                  onChange={(e) => setselectedGender(e.target.value)}
                  value={selectedGender || ""}
                >
                  <option value="" disabled>
                    select gender
                  </option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="undefined">prefer not to say</option>
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
            <div className="">
              {" "}
              <button
                className=""
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

export default AddStudentForm;
