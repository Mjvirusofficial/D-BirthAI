import React, { useContext, useState, useEffect, useRef } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, Shield, LogOut, Camera, ChevronRight, Settings, Bell, Save, X, Lock, Moon, Globe, Check, Eye, EyeOff, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { user, logout, token, fetchUser, loading } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const navigate = useNavigate();
    const topRef = useRef(null); // Reference for scrolling to top

    const [isEditing, setIsEditing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showSecurity, setShowSecurity] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Translation hook
    const { t, i18n } = useTranslation();

    // Settings State with LocalStorage persistence
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('userSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            notifications: true,
            darkMode: false,
            language: 'English'
        };
    });

    // Apply Dark Mode effect
    useEffect(() => {
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('userSettings', JSON.stringify(settings));
    }, [settings]);

    const toggleSetting = (key) => {
        setSettings(prev => {
            const newSettings = { ...prev };
            if (key === 'language') {
                const langs = ['English', 'Hindi', 'Hinglish'];
                const currentIndex = langs.indexOf(prev.language);
                const newLang = langs[(currentIndex + 1) % langs.length];
                newSettings.language = newLang;
                i18n.changeLanguage(newLang); // Change globally
            } else {
                newSettings[key] = !prev[key];
            }
            return newSettings;
        });
    };

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
        whatsappNumber: user?.whatsappNumber || ''
    });
    const [passData, setPassData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [photoPreview, setPhotoPreview] = useState(user?.avatar || '');
    const [birthdayCount, setBirthdayCount] = useState(0);

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/birthdays`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setBirthdayCount(data.length);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        if (token) fetchStats();
        if (token) fetchStats();
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                whatsappNumber: user.whatsappNumber || ''
            });
            setPhotoPreview(user.avatar || '');
        }
    }, [token, user]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setFormData(prev => ({ ...prev, avatar: reader.result }));
                setIsEditing(true); // Auto-enable editing when photo is changed
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchUser(token);
                setIsEditing(false);
                showNotification('Profile updated successfully!', 'success');
            } else {
                showNotification('Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification('Error updating profile', 'error');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passData.newPassword !== passData.confirmPassword) {
            showNotification("New passwords don't match!", 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    newPassword: passData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(data.msg || 'Password updated successfully!', 'success');
                setShowSecurity(false);
                setPassData({ newPassword: '', confirmPassword: '' });
            } else {
                showNotification(data.msg || 'Failed to update password', 'error');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            showNotification('Error updating password', 'error');
        }
    };

    const handleDeleteWhatsApp = async () => {
        if (!window.confirm("Are you sure you want to remove your WhatsApp number? This is mandatory and the popup will show again.")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ whatsappNumber: '' })
            });
            if (response.ok) {
                await fetchUser(token);
                showNotification("WhatsApp number removed successfully.", 'success');
            } else {
                showNotification("Failed to remove WhatsApp number.", 'error');
            }
        } catch (error) {
            console.error("Error removing whatsapp:", error);
            showNotification("Error removing whatsapp number.", 'error');
        }
    };

    const stats = [
        { label: t('birthdays'), value: birthdayCount.toString(), icon: Calendar, color: 'text-[#63b0b8]' },
        { label: t('wishes_sent'), value: '0', icon: Bell, color: 'text-[#A855F7]' },
        { label: t('member_since'), value: user ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '...', icon: Shield, color: 'text-[#FDE047]' },
    ];

    const menuItems = [
        {
            label: t('edit_profile'),
            icon: User,
            color: 'text-blue-500',
            action: () => {
                setIsEditing(true);
                // Scroll to top smoothly
                setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        },
        {
            label: t('settings'),
            icon: Settings,
            color: 'text-gray-500',
            action: () => setShowSettings(true)
        },
        {
            label: t('privacy_security'),
            icon: Shield,
            color: 'text-green-500',
            action: () => setShowSecurity(true)
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#63b0b8] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div ref={topRef} className="min-h-screen bg-white pt-4 pb-20 px-4 font-sans relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -right-[10%] w-[50vh] h-[50vh] bg-[#FDE047] rounded-full blur-[100px] opacity-20"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -left-[10%] w-[60vh] h-[60vh] bg-[#63b0b8] rounded-full blur-[120px] opacity-15"
                />
            </div>

            <div className="max-w-xl mx-auto relative z-10">
                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[40px] p-8 shadow-2xl shadow-gray-200/50 mb-8 relative"
                >
                    {/* Back Button inside card */}
                    <div className="absolute top-6 left-6 z-20">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/dashboard')}
                            className="p-2.5 bg-gray-50/50 hover:bg-white shadow-sm border border-gray-100 rounded-xl text-gray-600 hover:text-gray-900 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </motion.button>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatarInput').click()}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-2 bg-gradient-to-tr from-[#63b0b8] via-[#A855F7] to-[#FDE047] rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="relative w-32 h-32 rounded-full bg-white p-1 shadow-2xl border-2 border-white overflow-hidden">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                        <span className="text-5xl font-black text-[#63b0b8]">{user.name.charAt(0)}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                            </div>
                            <input
                                id="avatarInput"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>

                    </div>

                    <div className="w-full">
                        {isEditing ? (
                            <form onSubmit={handleSave} className="flex flex-col gap-4 w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block text-left">{t('full_name')}</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 focus:outline-none focus:border-[#63b0b8] focus:ring-1 focus:ring-[#63b0b8]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block text-left">{t('email_address')}</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 focus:outline-none focus:border-[#63b0b8] focus:ring-1 focus:ring-[#63b0b8]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block text-left">WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        value={formData.whatsappNumber}
                                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 focus:outline-none focus:border-[#63b0b8] focus:ring-1 focus:ring-[#63b0b8]"
                                        placeholder="10-digit number"
                                    />
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: user.name,
                                                email: user.email,
                                                avatar: user.avatar,
                                                whatsappNumber: user.whatsappNumber || ''
                                            });
                                            setPhotoPreview(user.avatar || '');
                                        }}
                                        className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-[#63b0b8] text-white rounded-2xl font-bold hover:bg-[#529aa0] transition-colors shadow-lg shadow-teal-500/20"
                                    >
                                        {t('save')}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center mt-2">
                                <h1 className="text-3xl font-black text-gray-900 tracking-tighter">{user.name}</h1>
                                <p className="text-gray-400 font-bold flex items-center justify-center gap-2 mt-1">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </p>
                            </div>
                        )}
                    </div>


                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-10">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-gray-50/50 rounded-3xl p-4 flex flex-col items-center text-center space-y-1 border border-gray-100">
                                <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
                                <span className="text-xl font-black text-gray-900">{stat.value}</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* WhatsApp Verification Card */}
                {!isEditing && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-emerald-50/50 backdrop-blur-xl border border-emerald-100 rounded-[30px] p-5 mb-6 flex items-center justify-between shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-emerald-100/50">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#25D366]">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.633 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">WhatsApp Integrated</p>
                                <p className="font-black text-gray-900 tracking-tight text-lg">
                                    +91 {user.whatsappNumber.toString().replace(/(\d{5})(\d{5})/, '$1 $2')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleDeleteWhatsApp}
                                className="p-2.5 bg-red-50 text-red-500 rounded-xl border border-red-100/50 hover:bg-red-500 hover:text-white transition-colors"
                                title="Remove Number"
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.button>
                            <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                                <Check className="w-3.5 h-3.5 stroke-[3px]" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Menu Options */}
                <div className="space-y-4">
                    {menuItems.map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={item.action}
                            className={`bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-5 flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-md transition-all ${isEditing && item.label === t('edit_profile') ? 'ring-2 ring-[#63b0b8] bg-white' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform`}>
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                </div>
                                <span className="font-black text-gray-800 tracking-tight">{item.label}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                        </motion.div>
                    ))}

                    {/* Logout Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-500 rounded-[32px] p-5 flex items-center justify-center gap-3 font-black transition-colors border border-red-100/50 mt-6 shadow-sm shadow-red-100"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out Account
                    </motion.button>
                </div>
                {/* Settings Modal */}
                <AnimatePresence>
                    {showSettings && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                            onClick={() => setShowSettings(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-gray-900">{t('settings')}</h2>
                                    <button onClick={() => setShowSettings(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Notifications Toggle */}
                                    <div
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer active:scale-95 transition-transform"
                                        onClick={() => toggleSetting('notifications')}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${settings.notifications ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'}`}>
                                                <Bell className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-gray-700">{t('notifications')}</span>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.notifications ? 'bg-[#63b0b8]' : 'bg-gray-300'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.notifications ? 'right-1' : 'left-1'}`}></div>
                                        </div>
                                    </div>

                                    {/* Dark Mode Toggle */}
                                    <div
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer active:scale-95 transition-transform"
                                        onClick={() => toggleSetting('darkMode')}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${settings.darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                                <Moon className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-gray-700">{t('dark_mode')}</span>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.darkMode ? 'bg-[#63b0b8]' : 'bg-gray-300'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.darkMode ? 'right-1' : 'left-1'}`}></div>
                                        </div>
                                    </div>

                                    {/* Language Toggle */}
                                    <div
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer active:scale-95 transition-transform"
                                        onClick={() => toggleSetting('language')}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 text-green-600 rounded-xl">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-gray-700">{t('language')}</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#63b0b8]">{settings.language}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Security Modal - Change Password */}
                <AnimatePresence>
                    {showSecurity && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                            onClick={() => setShowSecurity(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-gray-900">{t('security')}</h2>
                                    <button onClick={() => setShowSecurity(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handlePasswordChange} className="space-y-4">

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{t('new_password')}</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={passData.newPassword}
                                                onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                                                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 focus:outline-none focus:border-[#63b0b8] focus:ring-1 focus:ring-[#63b0b8]"
                                            />
                                            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#63b0b8] transition-colors">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{t('confirm_password')}</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={passData.confirmPassword}
                                                onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                                                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 focus:outline-none focus:border-[#63b0b8] focus:ring-1 focus:ring-[#63b0b8]"
                                            />
                                            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#63b0b8] transition-colors">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-[#63b0b8] text-white rounded-2xl font-bold hover:bg-[#529aa0] transition-colors shadow-lg shadow-teal-500/20 mt-4 flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-5 h-5" />
                                        {t('update_password')}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default Profile;
