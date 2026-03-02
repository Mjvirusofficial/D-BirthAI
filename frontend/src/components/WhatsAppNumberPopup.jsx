import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../apiConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CheckCircle, ArrowRight, X } from 'lucide-react';

const WhatsAppNumberPopup = ({ overrideView = false }) => {
    const { user, token, fetchUser } = useContext(AuthContext);
    const [showPopup, setShowPopup] = useState(overrideView);
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [countryCode, setCountryCode] = useState('91'); // Default India
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [updating, setUpdating] = useState(false);

    const countryCodes = [
        { code: '91', name: 'India', flag: '🇮🇳' },
        { code: '1', name: 'USA/Canada', flag: '🇺🇸' },
        { code: '44', name: 'UK', flag: '🇬🇧' },
        { code: '61', name: 'Australia', flag: '🇦🇺' },
        { code: '971', name: 'UAE', flag: '🇦🇪' },
        { code: '92', name: 'Pakistan', flag: '🇵🇰' },
        { code: '880', name: 'Bangladesh', flag: '🇧🇩' },
    ];

    useEffect(() => {
        // Simple logic: If we have a user and he has a number, we can hide it.
        // Otherwise, if we're here, it means we probably NEED it.
        const currentNumber = user?.whatsappNumber?.toString()?.trim();
        if (user && currentNumber && currentNumber !== '') {
            setShowPopup(false);
        } else {
            setShowPopup(true);
        }
    }, [user, overrideView]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const cleaned = whatsappNumber.replace(/\D/g, '');

        if (!cleaned || cleaned.length !== 10) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }

        const fullNumber = cleaned;

        setUpdating(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ whatsappNumber: fullNumber })
            });

            const data = await response.json();
            console.log("Backend response on PUT /user:", data);

            if (response.ok) {
                setSuccessMessage('Successfully integrated!');

                // Refresh user context so the app knows we have a number now
                await fetchUser(token);

                // Final verify before closing
                setTimeout(() => {
                    setShowPopup(false);
                }, 1500);
            } else {
                setError(data.msg || 'Update failed');
            }
        } catch (err) {
            setError('Network Error. Could not save.');
        } finally {
            setUpdating(false);
        }
    };

    if (!showPopup) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/20"
            >
                <div className="absolute inset-0 z-0 bg-transparent overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#63b0b8]/30 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#A855F7]/20 rounded-full blur-[120px]"
                    />
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 30 }}
                    className="relative z-10 w-full max-w-md bg-white border border-gray-100/50 shadow-[0_32px_100px_rgba(0,0,0,0.1)] rounded-[40px] p-8 md:p-10 overflow-hidden"
                >
                    {/* Progress Bar or Status */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50 overflow-hidden">
                        {updating && (
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="w-1/2 h-full bg-[#63b0b8]"
                            />
                        )}
                    </div>

                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.2 }}
                            className="bg-teal-50 w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-sm"
                        >
                            <Phone className="w-10 h-10 text-[#63b0b8] stroke-[2.5px]" />
                        </motion.div>

                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-3 leading-tight">
                            Verify Your <span className="text-[#63b0b8]">WhatsApp</span>
                        </h2>
                        <p className="text-gray-400 font-bold text-sm tracking-tight mb-8 leading-relaxed max-w-[280px] mx-auto">
                            Add your number to receive timely <br /> birthday reminders automatically.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex bg-gray-50 border border-gray-100 rounded-[24px] overflow-hidden focus-within:ring-2 focus-within:ring-[#63b0b8]/20 focus-within:border-[#63b0b8] transition-all duration-300">
                                <div className="bg-white border-r border-gray-100 px-4 py-4 flex items-center">
                                    <select
                                        className="appearance-none bg-transparent outline-none font-bold text-gray-700 cursor-pointer pr-1"
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                    >
                                        {countryCodes.map(c => (
                                            <option key={c.code} value={c.code}>{c.flag} +{c.code}</option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Enter 10-digit number"
                                    className="flex-1 px-5 py-5 bg-transparent outline-none font-bold text-gray-900 placeholder:text-gray-300 tracking-[0.1em]"
                                    value={whatsappNumber}
                                    onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    autoFocus
                                />
                            </div>

                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-red-500 font-bold text-xs bg-red-50 py-3 rounded-2xl"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                                {successMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-green-600 font-bold text-sm bg-green-50 py-4 rounded-3xl flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        {successMessage}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!successMessage && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={updating || whatsappNumber.length !== 10}
                                    className={`w-full py-5 rounded-[24px] font-black text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${whatsappNumber.length === 10
                                        ? 'bg-gray-900 text-white shadow-gray-200'
                                        : 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'
                                        }`}
                                >
                                    {updating ? 'Verifying...' : 'Integrate Now'}
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            )}
                        </form>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-relaxed">
                            Secured and Encrypted <br /> Integration
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WhatsAppNumberPopup;
