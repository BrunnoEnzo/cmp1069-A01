import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"

import {AppRoutes} from "./routes/AppRoutes.jsx";
import Navbar from "./components/navbar/navbar.jsx";

function App() {
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
