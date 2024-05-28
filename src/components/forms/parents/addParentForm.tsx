import { SyntheticEvent, useState } from "react";
import MainNavbar from "../../menus/MainNavbar";
import { useNavigate } from "react-router-dom";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import Select, { SingleValue } from "react-select";
import CountriesAndCodes from "../../../app/Data/CountriesAndCodes";
import countyData from "../../../app/Data/CountiesData";
import { ToastContainer, toast } from "react-toastify";

type SelectOption = {
  value: string;
  label: string;
};
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

const AddParentForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [selectedConstituency, setSelectedConstituency] =
    useState<Constituency | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [selectedGender, setselectedGender] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const handleNewParent = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    let response = await fetch(getPrivateUrl("actions/parent"), {
      method: "POST",
      headers: getHeadersWithAuth(),
      body: JSON.stringify({
        email: email,
        first_name: firstName,
        last_name: lastName,
        gender: selectedGender,
        phone_number: selectedCode + phone,
        county: selectedCounty,
        constituency: selectedConstituency,
        ward: selectedWard,
        password: password,
      }),
    });
    setEmail("");
    setFirstName("");
    setLastName("");
    setSelectedCounty(null);
    setselectedGender("");
    setSelectedConstituency(null);
    setSelectedWard(null);
    setSelectedCode("");
    setPassword("");
    setPhone("");
    setLoading(false);
    if (response.status == 201) {
      toast.success(
        "success, we shall email the parent the login credentials if email was entered"
      );
    } else if (response.status == 400) {
      toast.error(
        "mandatory fields were skipped or parent aleady registered on shulea"
      );
    } else if (response.status == 403) {
      toast.error("you have no rights to perform this ");
    } else if (response.status == 401) {
      localStorage.removeItem("access");
      navigate("/");
    } else {
      toast.error("you are not authenticated");
      // localStorage.removeItem("access");
      // navigate("/");
    }
  };

  const countryCodesOptions = CountriesAndCodes.map((country) => ({
    value: "+" + country.code,
    label: `+` + country.code + " " + `(${country.iso})`,
  }));

  const handleCodeChange = (selectedOption: SingleValue<SelectOption>) => {
    setSelectedCode(selectedOption?.value || "");
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

  return (
    <>
      <MainNavbar />
      <ToastContainer />
      <div className="app-content-start">
        <div className="add-start">
          <h2>Proceed to admit a parent</h2>
          <form action="" className="new-record-form">
            <div className="add-form">
              <div
                className=""
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  height: "60px",
                }}
              >
                <input
                  type="text"
                  value={email}
                  placeholder="email (optional)"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="add-input"
                />
                <p style={{ color: "red", marginBottom: "5px" }}>
                  needed only during login
                </p>
              </div>
            </div>

            <div className="add-form">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="first name"
                name="first_name"
                className="add-input"
              />
            </div>
            <div className="add-form">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder=" last name"
                name="last_name"
                className="add-input"
              />
            </div>
            <div className="add-form">
              <div className="" style={{ display: "flex", height: "50px" }}>
                <Select
                  options={countryCodesOptions}
                  className="custom-select-default"
                  classNamePrefix="custom-select__control"
                  placeholder="country"
                  onChange={handleCodeChange}
                  isSearchable
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      background: "aqua",
                      height: "100%",
                    }),
                  }}
                />
                <input
                  type="text"
                  style={{ height: "100%", marginLeft: "5px" }}
                  placeholder="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>
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
            <div className="add-form">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                name="password"
                className="add-input"
              />
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
              onClick={handleNewParent}
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
    </>
  );
};

export default AddParentForm;
