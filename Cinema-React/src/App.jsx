import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import Navbar from "./components/navbar/navbar"
import Home from "./pages/Home"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />       
      </Routes>
    </Router>
  );
}

export default App;
