import { useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ExpenditureItem {
  id: number;
  name: string;
}

function Expenditure() {
  const [receiptNo, setReceiptNo] = useState<number>(0);
  const [description, setDescription] = useState("");

  const [amount, setAmount] = useState<number>(0);
  const [ledgerNewBalance, setNewLedgerBalance] = useState<number>(0);
  const [ledgerCurrentBalance, setCurrentLedgerBalance] = useState<number>(0);
  const [ExpenditureItem, setExpenditureItems] = useState<ExpenditureItem[]>(
    []
  );
  const [selectedExpenditure, setSelectedExpenditure] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    ledgerData();
    getExpenditureItems();
  }, []);

  const handleExpenditureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedExpenditure = Number(e.target.value);
    setSelectedExpenditure(selectedExpenditure);
  };

  const getExpenditureItems = async () => {
    let response = await fetch(
      getPrivateUrl(`actions/all/financials/items/expense`),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 200) {
      let data = await response.json();
      setExpenditureItems(data);
    }
  };

  const generateReceiptNo = async () => {
    let response = await fetch(
      getPrivateUrl(`all/financial/our/school/generate/receipt/`),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 200) {
      toast.success("receipt number generated");
      let data = await response.json();
      setReceiptNo(data);
    } else {
      toast.error("receipt number not generated");
    }
  };
  const saveExpenditure = async () => {
    let response = await fetch(
      getPrivateUrl(`all/financial/our/school/save/expenditure`),
      {
        method: "POST",
        headers: getHeadersWithAuth(),
        body: JSON.stringify({
          amount: amount,
          description: description,
          receipt_number: receiptNo,
          ExpenditureItem: selectedExpenditure,
        }),
      }
    );
    if (response.status == 201) {
      toast.success("expenditure created");
      navigate("/ledger");
    } else if (response.status == 403) {
      toast.error("all inputs are mandatory");
    } else {
      toast.error("failed to record");
    }
  };
  const ledgerData = async () => {
    let response = await fetch(
      getPrivateUrl(`all/financial/our/school/transactions/`),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    let data = await response.json();
    setCurrentLedgerBalance(data.balance);
  };
  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div
          className=""
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div
            className=""
            style={{ display: "flex", flexDirection: "column" }}
          >
            <form
              className="form-ledger-flex"
              style={{ display: "flex", maxWidth: "100%" }}
            >
              <input
                required
                autoComplete="off"
                id="revenue-enter"
                className="revenue-enter"
                type="text"
                placeholder="amount eg 1000"
                name="amount"
                value={amount || ""}
                onKeyUp={() => {
                  let newBalance = ledgerCurrentBalance - amount;
                  setNewLedgerBalance(newBalance);
                }}
                onChange={(e) => {
                  const newValue: number | null = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    setAmount(newValue);
                  } else {
                    setAmount(null as any); // Handle case when newValue is null or NaN
                  }
                }}
              />
              <div
                className="revenue-input-container"
                id="revenue-input-container"
              >
                <input
                  required
                  value={receiptNo || ""}
                  onChange={(e) => {
                    const newValue: number | null = parseFloat(e.target.value);
                    if (!isNaN(newValue)) {
                      setReceiptNo(newValue);
                    } else {
                      setReceiptNo(null as any); // Handle case when newValue is null or NaN
                    }
                  }}
                  style={{
                    fontSize: "20px",
                    paddingRight: "40px",
                    border: "2px solid aqua",
                    width: "100%",
                  }} // Add
                  className="revenue-enter"
                  id="revenue-enter"
                  type="text"
                  placeholder="receipt"
                  name="receipt"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    generateReceiptNo();
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: "10px",
                    marginRight: "10px",
                    width: "100px",
                    background: "aqua",
                  }}
                >
                  Generate
                </button>
              </div>
              <select
                onChange={handleExpenditureChange}
                required
                className="revenue-enter"
                id="revenue-enter"
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                }}
              >
                <option disabled>select heading</option>
                {ExpenditureItem.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <input
                required
                autoComplete="off"
                className="revenue-enter"
                id="revenue-enter"
                type="text"
                placeholder="3 word description"
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
              <button
                className="post-revenue-btn"
                id="post-revenue-btn"
                onClick={(e) => {
                  e.preventDefault();
                  saveExpenditure();
                }}
              >
                save
              </button>
            </form>
            <p style={{ marginTop: "20px", marginLeft: "10px" }}>
              New ledger balance is KES {ledgerNewBalance}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Expenditure;
