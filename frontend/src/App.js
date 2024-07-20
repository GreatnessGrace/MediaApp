import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateAccount from "./pages/CreateAccount";
import LoginPage from "./pages/LoginPage";
import UploadData from "./pages/UploadData";
import ListingPage from "./pages/ListingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload-data" element={<UploadData />} />
        <Route path="/listing" element={<ListingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
