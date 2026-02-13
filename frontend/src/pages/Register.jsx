import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

import API_BASE_URL from '../apiConfig';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext); // Reuse login from context or add register
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Registration failed');
            }

            // Call login from context with the received token
            login(data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration failed', err);
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Send user data to backend
            const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    name: user.displayName,
                    googleId: user.uid
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Google Register failed on server');
            }

            // Call login from context with the received BACKEND token
            login(data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error("Google Register Error:", err);
            setError(err.message || "Google Sign-In failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden font-sans p-6">

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -right-[10%] w-[50vh] h-[50vh] bg-[#FDE047] rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
                <div className="absolute -bottom-[10%] -left-[10%] w-[50vh] h-[50vh] bg-[#F472B6] rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
                <div className="absolute top-[20%] left-[10%] w-[40vh] h-[40vh] bg-[#63b0b8] rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[40vh] h-[40vh] bg-[#A855F7] rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">

                {/* Logo Section with Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative flex items-center justify-center mb-4"
                >
                    {/* Snake/Orbital Ring Animation */}
                    <svg className="absolute w-40 h-40 -rotate-90">
                        <motion.circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="transparent"
                            stroke="#63b0b8"
                            strokeWidth="3"
                            strokeDasharray="60 180"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            style={{ filter: "drop-shadow(0 0 6px #63b0b8)" }}
                        />
                    </svg>

                    <div className="bg-white rounded-full shadow-lg border-4 border-[#FDE047] overflow-hidden flex items-center justify-center w-32 h-32 z-10 p-0">
                        <img src="/logo.jpg" alt="D-BirthAI Logo" className="w-full h-full object-cover" />
                    </div>
                </motion.div>

                {/* 
                  === ANIMATED BIRTHDAY SCENE === 
                  Cake (Left) + Walker (Right) → Computer appears when they meet
                */}
                <div className="relative w-full h-28 -mb-12 flex justify-center items-end overflow-visible pointer-events-none z-50">

                    {/* Confetti Explosion */}
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -50, x: 0, opacity: 0, scale: 0 }}
                            animate={{
                                y: [0, 150 + Math.random() * 50],
                                x: (Math.random() - 0.5) * 300,
                                opacity: [0, 1, 1, 0],
                                scale: [0, 1, 1, 0],
                                rotate: Math.random() * 720
                            }}
                            transition={{ delay: 6, duration: 3, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }}
                            className="absolute top-0 w-2 h-2 rounded-full z-[60]"
                            style={{
                                backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][i % 6],
                                left: '50%'
                            }}
                        />
                    ))}

                    {/* Character 1: Cake (From LEFT) - Fades out at 6s */}
                    <motion.div
                        initial={{ x: -150, opacity: 0 }}
                        animate={{ x: -40, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 6, times: [0, 0.1, 0.9, 1], ease: "easeInOut" }}
                        className="absolute bottom-6 left-1/2 -ml-8 z-50"
                    >
                        <div className="bg-white rounded-full shadow-lg border-4 border-pink-300 overflow-hidden flex items-center justify-center w-20 h-20">
                            <img
                                src="cake.gif"
                                alt="Birthday Cake"
                                className="w-full h-full object-cover mix-blend-multiply filter brightness-110 contrast-125"
                            />
                        </div>
                    </motion.div>

                    {/* Character 2: Walker (From RIGHT) - Fades out at 6s */}
                    <motion.div
                        initial={{ x: 150, opacity: 0 }}
                        animate={{ x: 40, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 6, times: [0, 0.1, 0.9, 1], ease: "easeInOut" }}
                        className="absolute bottom-6 left-1/2 -ml-8 z-50"
                    >
                        <div className="bg-white rounded-full shadow-lg border-4 border-blue-300 overflow-hidden flex items-center justify-center w-16 h-16">
                            <img
                                src="walk2.gif"
                                alt="Walking Character"
                                className="w-full h-full object-cover mix-blend-multiply filter brightness-110 contrast-125 transform scale-x-[-1]"
                            />
                        </div>
                    </motion.div>

                    {/* Computer appears when they meet (at 6s) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 6, duration: 0.5, type: "spring" }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50"
                    >
                        <img
                            src="computer.gif"
                            alt="Computer Celebration"
                            className="w-32 h-32 object-contain mix-blend-multiply filter brightness-110 contrast-125"
                        />
                    </motion.div>

                    {/* Fun Text */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 6.2, duration: 0.5, type: "spring" }}
                        className="absolute z-[60] bottom-0 w-full text-center"
                    >
                        <span className="text-[14px] font-black text-purple-600 tracking-widest drop-shadow-md" style={{ textShadow: '2px 2px 0px rgba(255,255,255,0.8)' }}>✨HAPPY BIRTHDAY!✨</span>
                    </motion.div>

                </div>

                {/* Register Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-white rounded-[40px] shadow-2xl p-8 flex flex-col items-center w-full border border-purple-50"
                >
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Create Account</h1>
                    <p className="text-gray-500 text-sm mb-6">Join D-BirthAI to start tracking</p>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    {/* Google Button at the Top */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleRegister}
                        className="w-full py-3 rounded-2xl bg-white border-2 border-gray-100 text-gray-700 font-bold text-sm shadow-sm hover:shadow-md hover:border-[#63b0b8] transition-all flex items-center justify-center gap-3 mb-6"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </motion.button>

                    <div className="flex items-center w-full mb-6">
                        <div className="flex-grow h-px bg-gray-200"></div>
                        <span className="px-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Or Sign Up With Email</span>
                        <div className="flex-grow h-px bg-gray-200"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 ml-2">Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7] focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 ml-2">Email</label>
                            <input
                                type="email"
                                placeholder="e.g. john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7] focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 ml-2">Password</label>
                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7] focus:outline-none transition-all"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            animate={{
                                backgroundColor: ["#ffa700", "#ffa700", "#63b0b8", "#63b0b8", "#ffa700"]
                            }}
                            transition={{
                                backgroundColor: { duration: 5, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1], ease: "easeInOut" }
                            }}
                            type="submit"
                            className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all mt-4"
                        >
                            Sign Up
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center text-gray-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#A855F7] font-bold hover:underline hover:text-[#9333ea]">
                            Log In
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
