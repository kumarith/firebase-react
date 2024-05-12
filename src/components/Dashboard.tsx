import React, { useState, ChangeEvent, FormEvent } from 'react';
import { firestore, storage } from '../firebaseSetup';

interface FormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    avatar: File | null;
}

const UserProfileForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        avatar: null
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFormData({ ...formData, avatar: file });
    };

    const handleSubmit =async (e: FormEvent) => {
        e.preventDefault();
        // Here you can handle form submission, for example, sending data to an API
        try {
            // Upload avatar to Firebase Storage if avatar exists
            let avatarUrl = '';
            if (formData.avatar) {
                const avatarRef = storage.ref().child(formData.avatar.name);
                await avatarRef.put(formData.avatar);
                avatarUrl = await avatarRef.getDownloadURL();
            }

            // Update user profile data in Firestore
            await firestore.collection('users').add({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                avatarUrl: avatarUrl, // URL of the uploaded avatar
                // Add any other fields you need
            });

            // Clear form after submission
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                avatar: null
            });

            console.log('Form submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        console.log(formData);
    };
        
   

    return (
        <div className="max-w-md mx-auto py-4 px-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400" placeholder="Your Name" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400" placeholder="Your Email" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Phone Number</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400" placeholder="Your Phone Number" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400" placeholder="Your Password" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="avatar" className="block text-gray-700 font-bold mb-2">Profile Picture/Avatar</label>
                    <input type="file" id="avatar" name="avatar" onChange={handleFileChange} accept="image/*" className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400" placeholder="Upload Profile Picture" />
                </div>
                <div className="mt-6">
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Save</button>
                </div>
            </form>
        </div>
    );

};



export default UserProfileForm;
