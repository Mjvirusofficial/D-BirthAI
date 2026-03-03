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
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-[4px] bg-black/40"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative z-10 w-full max-w-[320px] p-[3px] overflow-hidden rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_20px_rgba(99,176,184,0.2)]"
                >
                    {/* Rotating Border Animation Overlay */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#63b0b8,#A855F7,#FDE047,#63b0b8)] opacity-100"
                    />

                    <div className="relative z-10 bg-white rounded-[30px] p-6 w-full h-full">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mb-4">
                                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#25D366]">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.633 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">WhatsApp Alert</h3>
                            <p className="text-[13px] text-gray-500 mb-6 font-bold leading-relaxed px-2">
                                Get birthday reminders directly on your <span className="text-[#25D366]">whatsapp</span>
                            </p>

                            <form onSubmit={handleSubmit} className="w-full space-y-4">
                                <div className="flex bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#25D366]/30 transition-all">
                                    <div className="px-3 py-3 border-r border-gray-100 bg-gray-100/50">
                                        <select
                                            className="bg-transparent outline-none font-bold text-xs text-gray-700"
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                        >
                                            {countryCodes.map(c => (
                                                <option key={c.code} value={c.code}>+{c.code}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="Phone number"
                                        className="flex-1 px-3 py-3 bg-transparent outline-none font-bold text-sm text-gray-800 placeholder:text-gray-300"
                                        value={whatsappNumber}
                                        onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    />
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-2 rounded-lg"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                    {successMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-emerald-600 font-bold text-xs bg-emerald-50 py-2.5 rounded-xl flex items-center justify-center gap-2 border border-emerald-100"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            {successMessage}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!successMessage && (
                                    <button
                                        type="submit"
                                        disabled={updating || whatsappNumber.length !== 10}
                                        className={`w-full py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${whatsappNumber.length === 10
                                            ? 'bg-[#25D366] text-white hover:bg-[#128C7E] shadow-xl shadow-[#25D366]/30'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {updating ? 'Saving...' : 'Get Updates'}
                                        {!updating && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                )}
                            </form>

                            <p className="mt-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                Secure • Encrypted • Private
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WhatsAppNumberPopup;
