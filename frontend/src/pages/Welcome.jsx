import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Welcome = ({ onContinue }) => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const handleContinue = () => {
        if (onContinue) {
            onContinue();
        } else {
            if (token) {
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.8, // Delay between each element appearing
                delayChildren: 0.5    // Initial delay
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden font-sans p-6 text-center">

            {/* Background Decorations matching the theme */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -right-[10%] w-[50vh] h-[50vh] bg-[#FDE047] rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
                <div className="absolute -bottom-[10%] -left-[10%] w-[50vh] h-[50vh] bg-[#F472B6] rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md"
            >
                {/* 1. Logo (Large & Pulsing) */}
                <motion.div variants={itemVariants} className="relative flex items-center justify-center">
                    {/* Snake/Orbital Ring */}
                    <svg className="absolute w-64 h-64 -rotate-90">
                        <motion.circle
                            cx="128"
                            cy="128"
                            r="110"
                            fill="transparent"
                            stroke="#63b0b8"
                            strokeWidth="4"
                            strokeDasharray="100 300"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: 1,
                                opacity: 1,
                                rotate: 360
                            }}
                            transition={{
                                pathLength: { delay: 3.8, duration: 2 },
                                opacity: { delay: 3.8, duration: 1 },
                                rotate: { delay: 3.8, duration: 3, repeat: Infinity, ease: "linear" }
                            }}
                            style={{ filter: "drop-shadow(0 0 8px #63b0b8)" }}
                        />
                    </svg>

                    {/* Logo Container */}
                    <div className="mt-2 bg-white rounded-full shadow-lg border-4 border-[#FDE047] overflow-hidden flex items-center justify-center w-48 h-48 z-10 p-0">
                        <img
                            src="/logo.jpg"
                            alt="D-BirthAI Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>

                {/* 2. App Name */}
                <motion.div variants={itemVariants}>
                    <h1 className="text-5xl font-black text-gray-800 tracking-tight leading-none">
                        D-<span className="text-[#EC4899]">Birth</span><span className="text-[#F59E0B]">AI</span>
                    </h1>
                </motion.div>

                {/* 3. Slogan */}
                <motion.div
                    initial={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                    animate={{ opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        delay: 1.4 // Adjust delay to happen after App Name
                    }}
                >
                    <p className="text-2xl text-gray-500 font-medium tracking-wide uppercase">
                        Never Miss Any Birthday
                    </p>
                </motion.div>

                {/* 4. Continue Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        backgroundColor: ["#ffa700", "#ffa700", "#63b0b8", "#63b0b8", "#ffa700"]
                    }}
                    transition={{
                        opacity: { delay: 2.5, duration: 0.5 },
                        y: { delay: 2.5, type: "spring", stiffness: 100 },
                        backgroundColor: { duration: 8, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1], ease: "easeInOut" }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleContinue}
                    className="mt-3 px-10 py-4 text-white text-lg font-bold rounded-full shadow-xl transition-all flex items-center gap-2 group w-full justify-center sm:w-auto"
                >
                    Continue
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

            </motion.div>
        </div>
    );
};

export default Welcome;
