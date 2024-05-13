import React from "react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store"; // import your store and persistor
import { createRoot } from "react-dom/client";
import ReactGA from "react-ga4";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Failed to find the root element");
}
const root = createRoot(container);

ReactGA.initialize("G-95H26PWCVK");
ReactGA.send({ hitType: "pageview", page: window.location.pathname });
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
