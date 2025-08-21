import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import GlobalStyle from "./styles/global";

function App() {
  return (

    <>
    <GlobalStyle/>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </>

  );
}

export default App;
