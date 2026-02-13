import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Calendar, Clock, Sparkles, Heart, Gift, User, Phone, ChevronDown } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const AddBirthday = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        date: '',
        category: '',
        relationship: '',
        reminder: true,
        reminderTime: '09:00',
        reminderDays: '0',
        amPm: 'AM'
    });

    // Dropdown open/close states
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isRelationshipOpen, setIsRelationshipOpen] = useState(false);

    // Refs for dropdowns to detect outside clicks
    const categoryRef = useRef(null);
    const relationshipRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryOpen(false);
            }
            if (relationshipRef.current && !relationshipRef.current.contains(event.target)) {
                setIsRelationshipOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const categories = ['Family', 'GF', 'BF', 'Friends', 'Work', 'Teacher'];

    // Category-wise relationships
    const categoryRelationships = {
        'Family': ['Mom', 'Dad', 'Brother', 'Sister', 'Son', 'Daughter', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Cousin'],
        'GF': ['True Love', 'Time Pass'],
        'BF': ['True Love', 'Time Pass'],
        'Friends': ['Best Friend', 'Close Friend', 'Friend', 'Childhood Friend', 'College Friend'],
        'Work': ['Boss', 'Colleague', 'Team Member', 'Manager', 'Subordinate', 'Client'],
        'Teacher': ['School Teacher', 'College Professor', 'Tuition Teacher', 'Mentor', 'Guide']
    };

    // Get relationships based on selected category
    const getRelationships = () => {
        if (!formData.category) return [];
        return categoryRelationships[formData.category] || [];
    };

    // Photo upload state
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');

    // Handle photo selection
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.whatsapp || !formData.date || !formData.category || !formData.relationship) {
            alert('Please fill in all required fields!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login first!');
                navigate('/login');
                return;
            }

            // Prepare data to send
            const birthdayData = {
                name: formData.name,
                whatsapp: formData.whatsapp,
                date: formData.date,
                category: formData.category,
                relationship: formData.relationship,
                photo: photoPreview || '',
                reminder: formData.reminder,
                reminderTime: formData.reminderTime,
                reminderDays: formData.reminderDays,
                amPm: formData.amPm
            };

            const response = await fetch(`${API_BASE_URL}/api/birthdays`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(birthdayData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Birthday saved successfully! 🎉');
                navigate('/dashboard');
            } else {
                alert(data.message || 'Failed to save birthday');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error saving birthday. Please try again!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 relative overflow-hidden font-sans pt-6">
            {/* Soft Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40vh] h-[40vh] bg-[#63b0b8] rounded-full blur-[100px] opacity-10 animate-pulse-slow"></div>
                <div className="absolute bottom-[10%] -right-[10%] w-[40vh] h-[40vh] bg-[#FDE047] rounded-full blur-[100px] opacity-10 animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 max-w-lg mx-auto min-h-screen flex flex-col">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center justify-between p-6"
                >
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white shadow-sm border border-gray-100 rounded-2xl text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </motion.button>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">Add Birthday</h1>
                    <div className="w-11"></div> {/* Spacer for symmetry */}
                </motion.div>

                <form onSubmit={handleSave} className="px-6 pb-24 space-y-8 flex-grow">

                    {/* Photo Upload Section */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex justify-center"
                    >
                        <div className="relative group cursor-pointer" onClick={() => document.getElementById('photoInput').click()}>
                            <div className="w-32 h-32 rounded-[40px] bg-white shadow-2xl shadow-teal-500/10 border-4 border-white flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#63b0b8]/5 to-transparent"></div>
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-[#63b0b8]/30" />
                                )}
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -bottom-2 -right-2 bg-[#63b0b8] p-3 rounded-2xl shadow-xl shadow-teal-500/20 text-white border-2 border-white"
                            >
                                <Camera className="w-5 h-5" />
                            </motion.div>
                            <input
                                id="photoInput"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>
                    </motion.div>

                    {/* Form Fields Section */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-gray-500 text-xs font-black uppercase tracking-widest ml-1">Friend's Name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-5 pr-12 py-4 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm text-gray-800 font-bold placeholder-gray-300 shadow-sm focus:ring-2 focus:ring-[#63b0b8]/20 focus:border-[#63b0b8] outline-none transition-all"
                                    placeholder="Who are we celebrating?"
                                />
                                <div className="absolute right-4 top-0 bottom-0 flex items-center pointer-events-none">
                                    <Sparkles className="w-5 h-5 text-gray-300 group-focus-within:text-[#63b0b8] transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Number Input */}
                        <div className="space-y-2">
                            <label className="text-gray-500 text-xs font-black uppercase tracking-widest ml-1">WhatsApp Number</label>
                            <div className="relative group">
                                <input
                                    type="tel"
                                    required
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className="w-full pl-5 pr-12 py-4 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm text-gray-800 font-bold placeholder-gray-300 shadow-sm focus:ring-2 focus:ring-[#63b0b8]/20 focus:border-[#63b0b8] outline-none transition-all"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                                <div className="absolute right-4 top-0 bottom-0 flex items-center pointer-events-none">
                                    <Phone className="w-5 h-5 text-gray-300 group-focus-within:text-[#63b0b8] transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Date Input */}
                        <div className="space-y-2">
                            <label className="text-gray-500 text-xs font-black uppercase tracking-widest ml-1">Birthday Date</label>
                            <div className="relative group">
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full pl-5 pr-12 py-4 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm text-gray-800 font-bold outline-none focus:ring-2 focus:ring-[#63b0b8]/20 focus:border-[#63b0b8] transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <div className="absolute right-4 top-0 bottom-0 flex items-center pointer-events-none">
                                    <Calendar className="w-5 h-5 text-gray-300 group-focus-within:text-[#63b0b8] transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Category Custom Dropdown */}
                        <div className="space-y-2">
                            <label className="text-gray-500 text-xs font-black uppercase tracking-widest ml-1">Category</label>
                            <div ref={categoryRef} className="relative group">
                                {/* Dropdown Trigger */}
                                <div
                                    onClick={() => {
                                        setIsCategoryOpen(!isCategoryOpen);
                                        setIsRelationshipOpen(false);
                                    }}
                                    className="relative w-full pl-5 pr-14 py-4 rounded-2xl border border-gray-200 bg-white font-bold shadow-sm hover:shadow-md hover:border-[#63b0b8] focus:ring-2 focus:ring-[#63b0b8]/20 outline-none transition-all duration-200 cursor-pointer"
                                >
                                    <span className={formData.category ? 'text-gray-900' : 'text-gray-400'}>
                                        {formData.category || 'Select Category'}
                                    </span>
                                </div>

                                {/* ChevronDown Icon */}
                                <div className="absolute right-4 top-0 bottom-0 flex items-center pointer-events-none">
                                    <motion.div
                                        animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown className="w-5 h-5 text-[#63b0b8]" strokeWidth={2.5} />
                                    </motion.div>
                                </div>

                                {/* Dropdown Options Menu */}
                                <AnimatePresence>
                                    {isCategoryOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute z-50 w-full mt-2 py-2 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden"
                                        >
                                            {/* Show selected option first */}
                                            {categories
                                                .sort((a, b) => {
                                                    if (a === formData.category) return -1;
                                                    if (b === formData.category) return 1;
                                                    return 0;
                                                })
                                                .map((cat) => (
                                                    <div
                                                        key={cat}
                                                        onClick={() => {
                                                            setFormData({ ...formData, category: cat, relationship: '' });
                                                            setIsCategoryOpen(false);
                                                        }}
                                                        className={`px-5 py-3 font-bold cursor-pointer transition-colors duration-150 ${formData.category === cat
                                                            ? 'bg-[#63b0b8] text-white'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#63b0b8]'
                                                            }`}
                                                    >
                                                        {cat}
                                                        {formData.category === cat && (
                                                            <span className="ml-2 text-white">✓</span>
                                                        )}
                                                    </div>
                                                ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Relationship Custom Dropdown */}
                        <div className="space-y-2">
                            <label className="text-gray-500 text-xs font-black uppercase tracking-widest ml-1">Relationship</label>
                            <div ref={relationshipRef} className="relative group">
                                {/* Dropdown Trigger */}
                                <div
                                    onClick={() => {
                                        setIsRelationshipOpen(!isRelationshipOpen);
                                        setIsCategoryOpen(false);
                                    }}
                                    className="relative w-full pl-5 pr-14 py-4 rounded-2xl border border-gray-200 bg-white font-bold shadow-sm hover:shadow-md hover:border-[#63b0b8] focus:ring-2 focus:ring-[#63b0b8]/20 outline-none transition-all duration-200 cursor-pointer"
                                >
                                    <span className={formData.relationship ? 'text-gray-900' : 'text-gray-400'}>
                                        {formData.relationship || 'Select Relationship'}
                                    </span>
                                </div>

                                {/* ChevronDown Icon */}
                                <div className="absolute right-4 top-0 bottom-0 flex items-center pointer-events-none">
                                    <motion.div
                                        animate={{ rotate: isRelationshipOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown className="w-5 h-5 text-[#63b0b8]" strokeWidth={2.5} />
                                    </motion.div>
                                </div>

                                {/* Dropdown Options Menu */}
                                <AnimatePresence>
                                    {isRelationshipOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute z-50 w-full mt-2 py-2 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-y-auto max-h-64"
                                        >
                                            {!formData.category ? (
                                                <div className="px-5 py-3 text-gray-400 text-sm text-center">
                                                    Please select a category first
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Show selected option first */}
                                                    {getRelationships()
                                                        .sort((a, b) => {
                                                            if (a === formData.relationship) return -1;
                                                            if (b === formData.relationship) return 1;
                                                            return 0;
                                                        })
                                                        .map((rel) => (
                                                            <div
                                                                key={rel}
                                                                onClick={() => {
                                                                    setFormData({ ...formData, relationship: rel });
                                                                    setIsRelationshipOpen(false);
                                                                }}
                                                                className={`px-5 py-3 font-bold cursor-pointer transition-colors duration-150 ${formData.relationship === rel
                                                                    ? 'bg-[#63b0b8] text-white'
                                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#63b0b8]'
                                                                    }`}
                                                            >
                                                                {rel}
                                                                {formData.relationship === rel && (
                                                                    <span className="ml-2 text-white">✓</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Reminder Settings Card */}
                        <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-6 border border-white shadow-xl shadow-gray-200/50 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-[#63b0b8]" strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-black tracking-tight">Set Reminder</p>
                                        <p className="text-xs text-gray-400 font-medium">Schedule your wish</p>
                                    </div>
                                </div>
                                <div
                                    onClick={() => setFormData({ ...formData, reminder: !formData.reminder })}
                                    className={`w-14 h-8 rounded-full p-1.5 cursor-pointer transition-all duration-300 ${formData.reminder ? 'bg-[#63b0b8]' : 'bg-gray-200'}`}
                                >
                                    <motion.div
                                        animate={{ x: formData.reminder ? 24 : 0 }}
                                        className="w-5 h-5 bg-white rounded-full shadow-sm"
                                    />
                                </div>
                            </div>

                            {formData.reminder && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="pt-4 border-t border-gray-100 space-y-4"
                                >
                                    {/* Reminder Days Selector */}
                                    <div className="space-y-2">
                                        <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">Send Reminder</label>
                                        <select
                                            value={formData.reminderDays}
                                            onChange={(e) => setFormData({ ...formData, reminderDays: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-bold shadow-sm hover:shadow-md hover:border-[#63b0b8] focus:ring-2 focus:ring-[#63b0b8]/20 outline-none transition-all cursor-pointer"
                                        >
                                            <option value="0">Same Day</option>
                                            <option value="1">1 Day Before</option>
                                            <option value="2">2 Days Before</option>
                                            <option value="3">3 Days Before</option>
                                        </select>
                                    </div>

                                    {/* Time Picker with AM/PM */}
                                    <div className="space-y-2">
                                        <label className="text-gray-500 text-xs font-bold uppercase tracking-widest">At Time</label>
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Hour Select (1-12) */}
                                            <select
                                                value={(() => {
                                                    const [hours] = formData.reminderTime.split(':');
                                                    let hour = parseInt(hours);
                                                    if (hour === 0) return '12';
                                                    if (hour > 12) hour -= 12;
                                                    return hour.toString();
                                                })()}
                                                onChange={(e) => {
                                                    const [, minutes] = formData.reminderTime.split(':');
                                                    let hour = parseInt(e.target.value);

                                                    // Convert to 24-hour for storage
                                                    if (formData.amPm === 'PM' && hour !== 12) {
                                                        hour += 12;
                                                    } else if (formData.amPm === 'AM' && hour === 12) {
                                                        hour = 0;
                                                    }

                                                    setFormData({
                                                        ...formData,
                                                        reminderTime: `${hour.toString().padStart(2, '0')}:${minutes}`
                                                    });
                                                }}
                                                className="w-12 h-12 px-0 appearance-none rounded-xl border border-gray-200 bg-white text-gray-900 font-bold text-base text-center shadow-sm hover:shadow-md hover:border-[#63b0b8] focus:ring-2 focus:ring-[#63b0b8]/20 outline-none transition-all cursor-pointer flex items-center justify-center"
                                            >
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>

                                            <span className="text-lg font-black text-gray-400">:</span>

                                            {/* Minute Select (00-59) */}
                                            <select
                                                value={formData.reminderTime.split(':')[1]}
                                                onChange={(e) => {
                                                    const [hours] = formData.reminderTime.split(':');
                                                    setFormData({
                                                        ...formData,
                                                        reminderTime: `${hours}:${e.target.value}`
                                                    });
                                                }}
                                                className="w-12 h-12 px-0 appearance-none rounded-xl border border-gray-200 bg-white text-gray-900 font-bold text-base text-center shadow-sm hover:shadow-md hover:border-[#63b0b8] focus:ring-2 focus:ring-[#63b0b8]/20 outline-none transition-all cursor-pointer flex items-center justify-center"
                                            >
                                                {[...Array(60)].map((_, i) => (
                                                    <option key={i} value={i.toString().padStart(2, '0')}>
                                                        {i.toString().padStart(2, '0')}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* AM/PM Toggle Buttons */}
                                            <div className="flex gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const [hours, minutes] = formData.reminderTime.split(':');
                                                        let hour = parseInt(hours);
                                                        if (formData.amPm === 'PM' && hour >= 12) {
                                                            hour -= 12;
                                                        } else if (formData.amPm === 'AM' && hour < 12) {
                                                            // Already in AM
                                                        }
                                                        setFormData({
                                                            ...formData,
                                                            amPm: 'AM',
                                                            reminderTime: `${hour.toString().padStart(2, '0')}:${minutes}`
                                                        });
                                                    }}
                                                    className={`w-12 h-12 px-0 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${formData.amPm === 'AM'
                                                        ? 'bg-[#63b0b8] text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    AM
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const [hours, minutes] = formData.reminderTime.split(':');
                                                        let hour = parseInt(hours);
                                                        if (formData.amPm === 'AM' && hour < 12) {
                                                            hour += 12;
                                                        }
                                                        setFormData({
                                                            ...formData,
                                                            amPm: 'PM',
                                                            reminderTime: `${hour.toString().padStart(2, '0')}:${minutes}`
                                                        });
                                                    }}
                                                    className={`w-12 h-12 px-0 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${formData.amPm === 'PM'
                                                        ? 'bg-[#63b0b8] text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    PM
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-5 rounded-[24px] bg-[#63b0b8] text-white font-black text-lg shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/40 transition-all flex items-center justify-center gap-3 group"
                        >
                            Save Celebration
                            <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                        </motion.button>
                        <p className="text-center text-gray-400 text-[10px] mt-4 font-bold uppercase tracking-widest">D-BirthAI • Your automated wishing partner</p>
                    </div>

                </form >
            </div >
        </div >
    );
};

export default AddBirthday;
