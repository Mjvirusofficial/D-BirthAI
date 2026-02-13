import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API_BASE_URL from '../apiConfig';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { resetToken } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.put(`${API_BASE_URL}/api/auth/reset-password/${resetToken}`, { password });
            setMessage('Password updated successfully');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to update password');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden font-sans p-6">
            <div className="relative z-10 w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 flex flex-col items-center border border-purple-50">
                <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Reset Password</h1>
                <p className="text-gray-500 text-sm mb-6 text-center">
                    Enter your new password below.
                </p>

                {message && <div className="text-green-600 bg-green-50 p-3 rounded-lg mb-4 w-full text-center text-sm font-bold">{message}</div>}
                {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg mb-4 w-full text-center text-sm font-bold">{error}</div>}

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600 ml-2">New Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7] focus:outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600 ml-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7] focus:outline-none transition-all"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-4 rounded-2xl bg-[#63b0b8] text-white font-bold text-lg shadow-lg hover:bg-[#529aa0] transition-all"
                    >
                        Reset Password
                    </motion.button>
                </form>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    <Link to="/login" className="text-[#A855F7] font-bold hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
