import React from "react";
import Home from "./components/navigation/Home";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Admin from "./components/Admin";
import Register from "./components/Register";


const App = () => {

  return (
    <React.Fragment>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login"element={<Login />} />
            <Route path="/admin" element={<Admin/>} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
    </React.Fragment>
  );
};

export default App