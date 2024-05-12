import { useEffect, useState } from "react";
import { getHeadersWithAuth, getPrivateUrl } from "../../../app/ApiRequest";
import MainNavbar from "../../menus/MainNavbar";
import LedgerPieChart from "./LedgerPieChart";
import LedgerDoughnut from "./LedgerDoughnut";
import { useParams } from "react-router-dom";

interface Revenue {
  id: number;
  item_name: string;
  type: string;
  amount: number;
  percentage: number;
}
interface Expenditure {
  id: number;
  item_name: string;
  type: string;
  amount: number;
  percentage: number;
}

function LedgerInsights() {
  const [revenueInsight, setRevenueInsghts] = useState<Revenue[]>([]);
  const [expenditureInsight, setExpenditureInsghts] = useState<Expenditure[]>(
    []
  );
  const params = useParams();

  useEffect(() => {
    fetchLedgerInsights();
  }, []);
  const fetchLedgerInsights = async () => {
    if (params.from && params.to) {
      let response = await fetch(
        getPrivateUrl(
          `all/financials/our/school/ledger/items/stats/${params.from}/${params.to}`
        ),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setRevenueInsghts(data.revenue);
        setExpenditureInsghts(data.expenditure);
      }
    } else {
      let response = await fetch(
        getPrivateUrl(`all/financials/our/school/ledger/items/stats`),
        {
          method: "GET",
          headers: getHeadersWithAuth(),
        }
      );
      if (response.status == 200) {
        let data = await response.json();
        setRevenueInsghts(data.revenue);
        setExpenditureInsghts(data.expenditure);
      }
    }
  };
  return (
    <>
      <MainNavbar />
      <div className="app-content-start">
        <div className="ledger-insights-container">
          <div className="right-flex">
            <div
              className="container-revenue"
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "5px",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              <div style={{ width: "100%" }}>
                <h3 style={{ marginBottom: "10px" }}>Revenue Distribution</h3>
                <table>
                  <tbody>
                    <tr>
                      <th>#</th>
                      <th>vote head</th>
                      <th>Amount</th>
                      <th>%</th>
                    </tr>
                    {revenueInsight.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.item_name}</td>
                        <td>KES {item.amount}</td>
                        <td>{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div
                  className="diplay-insights-charts-flex-zone"
                  style={{
                    marginTop: "20px",
                    display: "flex",
                  }}
                >
                  <div className="">
                    <LedgerPieChart revenueData={revenueInsight} />
                  </div>
                  <div className="">
                    <LedgerDoughnut revenueData={revenueInsight} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="left-flex">
            <div
              className="container-revenue"
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              <div style={{ width: "100%" }}>
                <h3 style={{ marginBottom: "10px" }}>
                  Expenditure Distribution
                </h3>
                <table>
                  <tbody>
                    <tr>
                      <th>#</th>
                      <th>vote head</th>
                      <th>Amount</th>
                      <th>%</th>
                    </tr>
                    {expenditureInsight.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.item_name}</td>
                        <td>KES {item.amount}</td>
                        <td>{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div
                  className="diplay-insights-charts-flex-zone"
                  style={{
                    marginTop: "20px",
                    display: "flex",
                  }}
                >
                  <div className="">
                    <LedgerPieChart revenueData={expenditureInsight} />
                  </div>
                  <div className="">
                    <LedgerDoughnut revenueData={expenditureInsight} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LedgerInsights;
