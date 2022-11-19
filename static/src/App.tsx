import React, { createContext, useState } from "react";
import Home from "./components/navigation/Home";
import Login from "./components/auth/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Admin from "./components/auth/Admin";
import Register from "./components/auth/Register";
import AdminUI from "./components/adminInterface/AdminUI";

interface contextInterface {
  userID: number,
  sessionID: number,
  setUserID: React.Dispatch<React.SetStateAction<number>>,
  setSessionID: React.Dispatch<React.SetStateAction<number>>
}

export const context = createContext<contextInterface | null>(null)

const App = () => {

  const [userID, setUserID] = useState<number>(-1)
  const [sessionID, setSessionID] = useState<number>(-1)

  const sessionData: contextInterface = {
    userID: userID,
    sessionID: sessionID,
    setUserID: setUserID,
    setSessionID: setSessionID
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
          </Routes>
        </Router>
      </context.Provider>
    </React.Fragment>
  );
};

export default App