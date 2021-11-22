import "./App.css";
import BarCodeScanner from "./Components/BarCodeScanner";
import Home from "./Components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GooglePay from "./Components/GooglePay";
import PaymentSuccess from "./Components/PaymentSuccess";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/shopping-cart" element={<BarCodeScanner />} />
          <Route path="/gpay" element={<GooglePay />} />
          <Route path="/success" element={<PaymentSuccess />} />
        </Routes>
      </Router>
      {/* <BarCodeScanner /> */}
    </div>
  );
}

export default App;
