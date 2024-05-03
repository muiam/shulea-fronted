import { SyntheticEvent, useEffect, useState } from "react";
import MainNavbar from "../menus/MainNavbar";
import Select from "react-select";
import { getHeadersWithAuth, getPrivateUrl } from "../../app/ApiRequest";
import { ToastContainer, toast } from "react-toastify";

function ComposeNofication() {
  const [target, setTarget] = useState<string>("all"); // Initial state with 'all' selected
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    []
  );
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedMember, setSelectedMember] = useState<number>(0);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTarget(event.target.value);
  };

  useEffect(() => {
    staff();
  }, []);
  const staff = async () => {
    let response = await fetch(getPrivateUrl(`actions/all/school/staff/`), {
      method: "GET",
      headers: getHeadersWithAuth(),
    });
    if (response.status == 200) {
      let data = await response.json();
      const newOptions = data.map(
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
      setSubject("");
      setMessage("");
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    let response = await fetch(
      getPrivateUrl(`app/notifications/for/users/create/${target}`),
      {
        method: "POST",
        headers: getHeadersWithAuth(),
        body: JSON.stringify({
          subject: subject,
          message: message,
          recipient: selectedMember,
        }),
      }
    );
    if (response.status == 201) {
      toast.success("send");
      //created

      setSelectedMember(0);
      setSubject("");
      setMessage("");
    } else {
      toast.error("Not send, an error occurred");
      //not created message
      setSelectedMember(0);
      setSubject("");
      setMessage("");
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
            <div className="input-radio" id="radio-input-zone">
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
                value="teacher"
                name="target"
                checked={target == "teacher"}
                onChange={handleRadioChange}
              />
              <label htmlFor="target">Teachers</label>
              <input
                type="radio"
                value="parent"
                name="target"
                checked={target == "parent"}
                onChange={handleRadioChange}
              />
              <label htmlFor="target">Parents</label>
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
              <input
                onChange={(e) => setSubject(e.target.value)}
                value={subject}
                type="text"
                name="title"
                placeholder="a title/subject"
                style={{
                  border: "1px solid aqua",
                  height: "40px",
                  marginTop: "10px",
                }}
              />
              <textarea
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                cols={5}
                style={{
                  width: "300px",
                  height: "200px",
                  border: "1px solid aqua",
                  marginTop: "10px",
                }}
                placeholder="type your message here"
              ></textarea>
            </div>
            <button
              type="submit"
              style={{ background: "aqua", width: "100px", height: "50px" }}
            >
              send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ComposeNofication;
