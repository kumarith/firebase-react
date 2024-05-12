import { useState, useRef, FormEvent, useEffect } from 'react';
import { auth, firestore } from '../firebaseSetup';
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import firebase from 'firebase/app';
import { FaTimes, FaSave } from 'react-icons/fa';


interface FormData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  email: string;
  password: string;
  phone: string;
}


const Profile: React.FC = () => {
  const [emailError, setEmailError] = useState<string>("");
  const [saveSuccess, setsaveSuccess] = useState(false);
  const [saveError, setsaveError] = useState("");
  const [loggedInUserID, setLoggedInUserID] = useState<string>("");

  const [userData, setUserData] = useState<any>(null);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: "",
    password: "",
    phone: "",
  });

  const authContext = useContext(AuthContext);

  const fetchUserData = async () => {
    const userDocRef = firestore.collection("users").doc(authContext?.uid);

    // Retrieve the user details based on logged user uid from FireStore
    userDocRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const dbuserData = doc.data();
          console.log("db User data:", dbuserData);
          setUserData(dbuserData);
          const tempFromData = {
            firstName: dbuserData?.firstName,
            lastName: dbuserData?.lastName,
            address: dbuserData?.address,
            city: dbuserData?.city,
            email: dbuserData?.email,
            password: dbuserData?.password,
            phone: dbuserData?.phone,
          };
          setFormData(tempFromData);
          console.log("userData" + JSON.stringify(dbuserData));
        } else {
          setsaveError("No user data exits!");
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  };
  useEffect(() => {
    if (authContext?.uid) {  /**To avoid rerenders */
      fetchUserData();
    }
  }, [authContext?.uid]); 
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmailChange = (e: FormEvent<HTMLInputElement>) => {
    const emailValue = e.currentTarget.value;
    setFormData({ ...formData, email: emailValue });

    // Validate email
    if (!emailValue.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async () => {
    
    //alert("hi1");
    // Check if email is valid before submitting
    if (!emailError) {
      try {
        setsaveError("");
        setsaveSuccess(true);
        //alert("here 1");
        /** Logged in userId is doc id and set new values from form */
        await firestore.collection("users").doc(authContext?.uid).set({
          id: authContext?.uid,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          email: formData.email,
          phone: formData.phone,
        });
        //alert("here 2");
        setsaveSuccess(true);
        console.log("Saved info successfully!");
      } catch (error) {
        console.error("Error creating user:", error);
        setsaveSuccess(false);
        setsaveError("Failed to Save. " + error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-4 px-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

      {saveSuccess && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">
            {" "}
            Your account has been saved successfully. Please click {" "}
            <a href="/login"> here </a> to go to home
          </span>
        </div>
      )}
      {saveError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {saveError}</span>
        </div>
      )}

      <form >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-gray-700 font-bold mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              ref={firstNameRef}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
              placeholder="First Name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-gray-700 font-bold mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              ref={lastNameRef}
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
              placeholder="Last Name"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label
            htmlFor="address"
            className="block text-gray-700 font-bold mb-2"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            ref={addressRef}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
            placeholder="Address"
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="city" className="block text-gray-700 font-bold mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            ref={cityRef}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
            placeholder="City"
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            ref={phoneRef}
            className="border  border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
            placeholder="Phone Number"
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleEmailChange}
            ref={emailRef}
            className={`border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none ${
              emailError ? "border-red-500" : "focus:border-blue-400"
            }`}
            placeholder="Email"
            required
          />
          {emailError && (
            <p className="text-red-500 mt-1 text-sm">{emailError}</p>
          )}
        </div>
        <div className="mt-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            ref={passwordRef}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
            placeholder="Password"
            required
          />
        </div>
        <div className="mt-6 flex justify-between">
          <a
            href="#"
            className="text-blue-500 hover:text-blue-700 font-bold flex items-center space-x-2"
            role="button"
            type="submit"
            onClick={() => handleSubmit()}
          >
            <FaSave />
            <span>Save </span>
          </a>
          <div className="flex-grow"></div>
          <a
            href="/login"
            className="text-blue-500 hover:text-blue-700 font-bold flex items-center space-x-2"
          >
            <FaTimes />
            <span>Cancel</span>
          </a>
        </div>
      </form>
    </div>
  );
};

export default Profile;
