import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
            setMessage('Email sent! Please check your inbox.');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to send email. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden font-sans p-6">
            <div className="relative z-10 w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 flex flex-col items-center border border-purple-50">
                <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Forgot Password</h1>
                <p className="text-gray-500 text-sm mb-6 text-center">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {message && <div className="text-green-600 bg-green-50 p-3 rounded-lg mb-4 w-full text-center text-sm font-bold">{message}</div>}
                {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg mb-4 w-full text-center text-sm font-bold">{error}</div>}

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600 ml-2">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7] focus:outline-none transition-all"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-4 rounded-2xl bg-[#63b0b8] text-white font-bold text-lg shadow-lg hover:bg-[#529aa0] transition-all"
                    >
                        Send Reset Link
                    </motion.button>
                </form>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    Remembered?{' '}
                    <Link to="/login" className="text-[#A855F7] font-bold hover:underline">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
