import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard, PlusCircle, User } from 'lucide-react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const location = useLocation();
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 50) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home', icon: null },
        ...(user ? [{ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
    ];

    return (
        <motion.nav
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: "-100%", opacity: 0 }
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 w-full z-50 px-4 py-3 sm:px-6 sm:py-4"
        >
            <div className="max-w-7xl mx-auto">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[24px] px-6 py-3 flex items-center justify-between transition-all duration-300">

                    {/* Brand / Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-1 bg-gradient-to-tr from-[#63b0b8] via-[#A855F7] to-[#FDE047] rounded-full opacity-70 blur-[2px] group-hover:opacity-100 transition-opacity"
                            />
                            <div className="relative bg-white rounded-full p-0.5 overflow-hidden w-10 h-10 border border-brand-teal/20">
                                <img src="/logo.jpg" alt="Logo" className="w-full h-full rounded-full object-cover" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="text-xl font-black tracking-tighter text-gray-800 leading-none"
                            >
                                D-<span className="text-[#63b0b8]">Birth</span><span className="text-[#A855F7]">AI</span>
                            </motion.span>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-0.5">Never Miss Any Birthday✨</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="relative group py-2"
                                >
                                    <span className={`text-sm font-bold tracking-wide transition-colors ${isActive(link.path) ? 'text-[#63b0b8]' : 'text-gray-500 hover:text-[#63b0b8]'
                                        }`}>
                                        {link.label}
                                    </span>
                                    {isActive(link.path) && (
                                        <motion.div
                                            layoutId="navUnderline"
                                            className="absolute bottom-0 left-0 w-full h-0.5 bg-[#63b0b8] rounded-full"
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        <div className="h-6 w-px bg-gray-100 mx-2" />

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/add-birthday">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-[#63b0b8] to-[#63b0b8]/80 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#63b0b8]/20 font-bold text-sm flex items-center gap-2"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Birthday
                                    </motion.button>
                                </Link>

                                <div className="flex items-center gap-3 bg-gray-50 pl-2 pr-1 py-1 rounded-xl border border-gray-100">
                                    <span className="text-gray-700 text-xs font-bold pl-2">Hi, {user.name.split(' ')[0]}</span>
                                    <motion.button
                                        whileHover={{ scale: 1.1, backgroundColor: '#fee2e2' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={logout}
                                        className="p-2 text-red-500 rounded-lg transition-colors hover:text-red-600"
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="text-gray-500 hover:text-gray-800 font-bold text-sm px-4 py-2"
                                    >
                                        Log In
                                    </motion.button>
                                </Link>
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-200 font-bold text-sm"
                                    >
                                        Get Started
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-gray-50 text-gray-800 p-2.5 rounded-xl border border-gray-100 shadow-sm"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="md:hidden mt-3"
                    >
                        <div className="bg-white/90 backdrop-blur-2xl border border-white/20 shadow-xl rounded-[24px] px-6 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block text-lg font-black tracking-tight ${isActive(link.path) ? 'text-[#63b0b8]' : 'text-gray-400'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                                {user ? (
                                    <>
                                        <Link to="/add-birthday" onClick={() => setIsOpen(false)}>
                                            <button className="w-full bg-[#63b0b8] text-white px-6 py-4 rounded-2xl font-black text-center shadow-lg shadow-teal-100 flex items-center justify-center gap-2">
                                                <PlusCircle className="w-5 h-5" />
                                                Add Birthday
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => { logout(); setIsOpen(false); }}
                                            className="w-full bg-red-50 text-red-500 px-6 py-4 rounded-2xl font-black text-center"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsOpen(false)}>
                                            <button className="w-full text-center text-gray-500 font-black py-4">Log In</button>
                                        </Link>
                                        <Link to="/register" onClick={() => setIsOpen(false)}>
                                            <button className="w-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-purple-100 text-center">
                                                Get Started
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
