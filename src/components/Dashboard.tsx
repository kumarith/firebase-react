// Import necessary modules
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { getDocs, collection } from 'firebase/firestore';

import { auth, firestore } from '../firebaseSetup';
import { Link } from 'react-router-dom';



interface userType {
    uid: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    email: string;
    password: string;
    phone: string;
  }

const Dashboard = () => {
    const [users, setUsers] = useState<userType[]>([]);

  useEffect(() => {
    // Fetch all users from Firestore
    const fetchUsers = async () => {
      try {
        const userCollection = await firestore.collection('users').get();
        const userList: userType[] = userCollection.docs.map(doc => doc.data() as userType);
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto">
    <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">UserID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.uid} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="px-4 py-2">{user.uid}</td>
              <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.phone}</td>
              <td className="px-4 py-2">{user.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-4 text-center">
     <Link to="/login" className="text-blue-500 hover:underline">Go to Login</Link>
    </div>
  </div>
  
  );
};

export default Dashboard;
