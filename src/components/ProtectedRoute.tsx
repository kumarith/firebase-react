import React from "react";
import { Navigate } from "react-router-dom";
import "firebase/auth";
import { AuthContext } from "../context/AuthContext";

interface Props {
    children?: React.ReactNode;
  }

 
const ProtectedRoute: React.FC<Props> = ({children }) => {
    const user = React.useContext(AuthContext);
  
    console.log("Check user in Private: ", user);
    if (!user) {
      return <Navigate to="/" />;
    }
    return children;

  };

  export default ProtectedRoute