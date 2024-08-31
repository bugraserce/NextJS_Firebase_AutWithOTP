'use client'
import React, { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '../FireBase/config';
import { db } from '../FireBase/config';
import { collection,addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const Register = () => {
   
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [username,setUsername] = useState('')
    const navigate = useRouter();

    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)



    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await createUserWithEmailAndPassword(email, password);
            console.log(response);
            if(response.operationType === 'signIn') {

                navigate.push('/login')
            }

           
        

        } catch (error) {
            console.error("Error during sign up:", error.message);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-white text-center">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
              
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
