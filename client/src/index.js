import React, { useContext, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MainContext } from "./Main";

const root = ReactDOM.createRoot(document.getElementById("root"));

function Index() {
  const [isLoggedin, setIsLoggedin] = useState(false);

  return (
    <MainContext.Provider value={{ isLoggedin, setIsLoggedin }}>
      <React.StrictMode>
        <App isLoggedin={isLoggedin} />
      </React.StrictMode>
    </MainContext.Provider>
  );
}

root.render(<Index />);

reportWebVitals();
