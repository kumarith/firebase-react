import { useState, useRef, FormEvent } from 'react';
import { auth, firestore } from '../firebaseSetup';

interface FormData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  email: string;
  password: string;
  phone: string;

}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    email: '',
    password: '',
    phone :'',
  });
  const [emailError, setEmailError] = useState<string>('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState('');


  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmailChange = (e: FormEvent<HTMLInputElement>) => {
    const emailValue = e.currentTarget.value;
    setFormData({ ...formData, email: emailValue });

    // Validate email
    if (!emailValue.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check if email is valid before submitting
    if (!emailError) {
      try {
        setSignupError('');
        setSignupSuccess(false);


        const userCredential = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
        const user = userCredential.user;
        alert("User (UID "+user?.uid +") created.");
        await auth.signOut(); // Sign out the current user nd go to login, createUserWithEmailAndPassword also signs in

        setSignupSuccess(true);
        alert("here 1")
        await firestore.collection('users').doc(user?.uid).set({
          id:  user?.uid,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          email: formData.email,
          phone: formData.phone,

        });
        alert("here 2")


        // Clear form after submission
        setFormData({
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          email: '',
          password: '',
          phone:'',
        });
        setSignupSuccess(true);

        console.log('User created successfully!');
      } catch (error) {
        console.error('Error creating user:', error);
        setSignupSuccess(false);
        setSignupError('Failed to sign up. Please try again. '+error );

      }
    }
  };

  return (

    <div className="max-w-md mx-auto py-4 px-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
      
      {signupSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your account has been created successfully. Please log in  <a href="/login"> here </a>.</span>
        </div>
      )}
    {signupError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {signupError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">First Name</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} ref={firstNameRef} onChange={handleChange} className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400" placeholder="First Name" required />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">Last Name</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} ref={lastNameRef} className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400" placeholder="Last Name" required />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="address" className="block text-gray-700 font-bold mb-2">Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} ref={addressRef} className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400" placeholder="Address" required />
        </div>
        <div className="mt-4">
          <label htmlFor="city" className="block text-gray-700 font-bold mb-2">City</label>
          <input type="text" id="city" name="city" value={formData.city} onChange={handleChange}  ref={cityRef} className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400" placeholder="City" required />
        </div>
        <div className="mt-4">
            <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Phone Number</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} ref={phoneRef} className="border  border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400" placeholder="Phone Number" required />
    </div>
        <div className="mt-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleEmailChange} ref={emailRef} className={`border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none ${emailError ? 'border-red-500' : 'focus:border-blue-400'}`} placeholder="Email" required />
          {emailError && <p className="text-red-500 mt-1 text-sm">{emailError}</p>}
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} ref={passwordRef} className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400" placeholder="Password" required />
        </div>
        <div className="mt-6">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
