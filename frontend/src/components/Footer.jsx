import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, Instagram, Twitter, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative mt-20 pb-10 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[40px] px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                        {/* Brand Column */}
                        <div className="col-span-1 md:col-span-1.5 space-y-6">
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="bg-white rounded-full p-0.5 w-10 h-10 border border-brand-teal/20 shadow-sm">
                                    <img src="/logo.jpg" alt="Logo" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-gray-800">
                                    D-<span className="text-[#63b0b8]">Birth</span><span className="text-[#A855F7]">AI</span>
                                </span>
                            </Link>
                            <p className="text-gray-500 text-sm font-bold leading-relaxed max-w-xs">
                                Making celebrations smarter and more personal with AI-driven birthday tracking and automated wishes. ✨
                            </p>
                            <div className="flex items-center gap-4 pt-2">
                                {[Instagram, Twitter, Mail].map((Icon, i) => (
                                    <motion.a
                                        key={i}
                                        href="#"
                                        whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2.5 bg-gray-50 text-gray-400 rounded-xl transition-all hover:text-[#63b0b8] border border-gray-100"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-gray-900 font-black text-sm uppercase tracking-widest mb-6">Quick Links</h4>
                            <ul className="space-y-4">
                                {['Home', 'Dashboard', 'Add Birthday', 'Contact'].map((item) => (
                                    <li key={item}>
                                        <Link
                                            to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                            className="text-gray-500 hover:text-[#63b0b8] transition-colors text-sm font-bold"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-gray-900 font-black text-sm uppercase tracking-widest mb-6">Support</h4>
                            <ul className="space-y-4">
                                {['Help Center', 'Safety', 'Terms', 'Privacy'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-gray-500 hover:text-[#A855F7] transition-colors text-sm font-bold">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter/Contact */}
                        <div className="space-y-6">
                            <h4 className="text-gray-900 font-black text-sm uppercase tracking-widest mb-6">Get in Touch</h4>
                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-4">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Mail className="w-4 h-4 text-[#A855F7]" />
                                    <span className="text-xs font-bold uppercase tracking-wide">support@dbirthai.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500">
                                    <MapPin className="w-4 h-4 text-[#63b0b8]" />
                                    <span className="text-xs font-bold uppercase tracking-wide">Made with ❤️ in India</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-center">
                        <p className="text-gray-400 text-xs font-bold tracking-wider">
                            © 2026 D-BIRTHAI. ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <span>Designed for the next generation</span>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
