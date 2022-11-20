import React, { createContext, useRef, useState } from "react";
import Home from "./components/navigation/Home";
import Login from "./components/auth/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Admin from "./components/auth/Admin";
import Register from "./components/auth/Register";
import AdminUI from "./components/adminInterface/AdminUI";
import FinishRegistration from "./components/auth/FinishRegistration";
import User from "./components/userUI/User";

interface contextInterface {
  userID: number,
  sessionID: number,

}

export const context = createContext<contextInterface | null>(null)

const App = () => {

  //will cause errors on logout after page refresh.. can be resolved by using local storage i guess
  const userID = useRef<number>(-1)
  const sessionID = useRef<number>(-1)

  const sessionData: contextInterface = {
    userID: userID.current,
    sessionID: sessionID.current
  }


  return (
    <React.Fragment>
      <context.Provider value = {sessionData}>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login"element={<Login />} />
            <Route path="/login/admin" element={<Admin/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminUI />} />
            <Route path="/register/finish" element={<FinishRegistration />} />
            <Route path="/user" element={<User />} />
          </Routes>
        </Router>
      </context.Provider>
    </React.Fragment>
  );
};

export default App