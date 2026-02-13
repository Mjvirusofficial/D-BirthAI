import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex flex-col items-center justify-center overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -right-[10%] w-[50vh] h-[50vh] bg-[#FDE047] rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-[10%] -left-[10%] w-[50vh] h-[50vh] bg-[#F472B6] rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute top-[20%] left-[10%] w-[40vh] h-[40vh] bg-[#63b0b8] rounded-full blur-3xl opacity-20 animate-pulse"></div>
            </div>

            {/* Logo with Orbital Ring - RESTORED TO BIG SIZE */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative flex items-center justify-center mb-8 z-10"
            >
                {/* Orbital Ring Animation */}
                <svg className="absolute w-56 h-56 -rotate-90">
                    <motion.circle
                        cx="112"
                        cy="112"
                        r="100"
                        fill="transparent"
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        strokeDasharray="90 220"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ filter: "drop-shadow(0 0 8px #63b0b8)" }}
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: '#d946ef', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Logo */}
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-white rounded-full shadow-2xl border-4 border-[#FDE047] overflow-hidden flex items-center justify-center w-48 h-48 z-10"
                >
                    <img src="/logo.jpg" alt="D-BirthAI Logo" className="w-full h-full object-cover" />
                </motion.div>
            </motion.div>

            {/* Animated Loading Text - SMALLER SIZE */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-1 z-10 px-4 py-1.5 rounded-full"
            >
                <div className="flex space-x-0.5">
                    {['L', 'O', 'A', 'D', 'I', 'N', 'G'].map((letter, index) => (
                        <motion.span
                            key={index}
                            animate={{
                                y: [0, -4, 0],
                                color: ['#63b0b8', '#A855F7', '#FDE047', '#63b0b8'] // Cycling colors
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: index * 0.1, // Staggered delay for wave effect
                                ease: "easeInOut",
                                color: { duration: 3, repeat: Infinity }
                            }}
                            className="text-2xl font-black tracking-widest drop-shadow-sm"
                            style={{
                                textShadow: '0 1px 4px rgba(168, 85, 247, 0.2)'
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </div>

                {/* Dots - SMALLER */}
                <div className="flex gap-1 ml-1.5 mt-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                                backgroundColor: ['#63b0b8', '#A855F7', '#FDE047'][i]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                            className="w-1.5 h-1.5 rounded-full"
                        />
                    ))}
                </div>
            </motion.div>

        </div>
    );
};

export default LoadingScreen;
