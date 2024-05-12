import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebaseSetup";
//import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserEdit } from 'react-icons/fa';



const UserSignin =  () => {

  const user = useContext(AuthContext);

  //const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [signInError, setSignInError] = useState<string>('');



  const handleSignIn = async () => {
    try {
        setSignInError('');
      await auth.signInWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      );
    } catch (error) {
        setSignInError("Failed to Login"+error);
      console.error(error + " pritning sign in error");
    }
  };

 const signOut = async () => {
    await auth.signOut();
  };
 

  return (
    <>
    <div className="w-full max-w-xs mx-auto">
  

  {!user ? (<div className="flex flex-col justify-center items-center min-h-screen">
  <h2 className="text-3xl font-bold mb-6">Login</h2>

  {signInError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {signInError}</span>
        </div>
      )}

  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        <i className="fas fa-user mr-2"></i> Username
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ref={emailRef}
        id="username"
        type="text"
        placeholder="Username"
      />
    </div>
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        <i className="fas fa-lock mr-2"></i> Password
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        ref={passwordRef}
        id="password"
        type="password"
        placeholder="*********"
      />
    </div>
    <div className="flex items-center justify-between">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={handleSignIn}
      >
        Sign In
      </button>
      <a
        href="/signup"
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Sign Up
      </a>
    </div>
  </form>
</div>
   ) : (

<div className="flex flex-col justify-center items-center min-h-screen">
  <h3 className="text-3xl font-bold mb-6">Welcome</h3>
  <h4>{user.email}</h4>
  <br></br>
  <br></br>
  <div className="mb-4 flex items-center space-x-4">
    <div>
      <a
        href="#"
        className="text-blue-500 hover:text-blue-700 font-bold flex items-center space-x-2"
        role="button"
        onClick={signOut}
      >
        <FaSignOutAlt />
        <span>Sign Out</span>
      </a>
    </div>
    <div>
      <a
        href="/profile"
        className="text-blue-500 hover:text-blue-700 font-bold flex items-center space-x-2"
      >
        <FaUserEdit />
        <span>Edit Profile</span>
      </a>
    </div>
  </div>
</div>
  )}
</div>
    </>
  );
};

export default UserSignin;