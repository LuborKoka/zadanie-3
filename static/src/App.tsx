import React from "react";
import Home from "./components/navigation/Home";
import Login from "./components/auth/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Admin from "./components/auth/Admin";
import Register from "./components/auth/Register";
import AdminUI from "./components/adminInterface/AdminUI";


const App = () => {

  return (
    <React.Fragment>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login"element={<Login />} />
            <Route path="/login/admin" element={<Admin/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminUI />} />
          </Routes>
        </Router>
    </React.Fragment>
  );
};

export default App