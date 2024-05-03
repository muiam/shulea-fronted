import { useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import { ToastContainer, toast } from "react-toastify";

interface Wallet {
  id: number;
  name: string;
  Adm: string;
  carryforward_amount: number;
  level: string;
}
function WalletBalances() {
  const [wallet, setWallet] = useState<Wallet[]>([]);
  const [total, setTotals] = useState<number>(0);

  useEffect(() => {
    fetchWalletBalances();
  }, []);
  const fetchWalletBalances = async () => {
    let response = await fetch(
      getPrivateUrl(`all/financial/our/school/total/wallet`),
      {
        method: "GET",
        headers: getHeadersWithAuth(),
      }
    );
    if (response.status == 200) {
      toast.success("success");
      let data = await response.json();
      setWallet(data.students);
      setTotals(data.total_carryforward);
    } else {
      toast.error("process failed");
    }
  };

  return (
    <>
      <ToastContainer />
      <MainNavbar />
      <div className="app-content-start">
        <div style={{ marginRight: "20px", marginTop: "20px" }}>
          <table>
            <tbody>
              <tr>
                <th>#</th>
                <th>Adm/Nemis Number</th>
                <th>student</th>
                <th>Grade</th>
                <th>Balance</th>
              </tr>
              {wallet.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.Adm}</td>
                  <td>{item.name}</td>
                  <td>grade {item.level}</td>
                  <td>KES {item.carryforward_amount}</td>
                </tr>
              ))}

              <tr>
                <td colSpan={4} align="right">
                  <strong>Totals:</strong>
                </td>
                <td>
                  <strong>KES {total}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default WalletBalances;
