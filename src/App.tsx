import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./provider/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import Profile from "./components/Profile";

import { AuthContext } from "./context/AuthContext";
import SignUp from "./components/SignUp";


const App =  () => {

  const user = React.useContext(AuthContext);

  return (
    <>
    <AuthProvider >
    <Router>
        <Routes>
          <Route path="/login" element={<SignIn/>} />
          <Route path="/" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
          { /* <Route path="/profile" element={<ProtectedRoute children={<Profile />} />} /> */}
          <Route path="/profile" element={<Profile/>}  >
          </Route>
          /** SHoule be ideally in protecteed route after verifying user role as admin */
          <Route path="/dashboard" element={<Dashboard/>}  />

        </Routes>
      </Router>
      </AuthProvider>
    
    </>
  )
  
}

/*<ProtectedRoute path="/dashboard" element={<Dashboard/>} />*/

export default App;