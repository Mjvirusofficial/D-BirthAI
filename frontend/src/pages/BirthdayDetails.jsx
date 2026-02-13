import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Calendar, Clock, Sparkles, User, Phone, ChevronDown, Edit, Save, X, Trash2, Instagram, StickyNote, Plus } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const BirthdayDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        date: '',
        category: '',
        relationship: '',
        reminder: true,
        reminderTime: '09:00',
        reminderDays: '0',
        amPm: 'AM',
        bio: '',
        instagram: ''
    });

    const [extraStats, setExtraStats] = useState({
        age: 0,
        daysLeft: 0,
        birthDayName: ''
    });

    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');

    // Dropdown States
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isRelationshipOpen, setIsRelationshipOpen] = useState(false);
    const categoryRef = useRef(null);
    const relationshipRef = useRef(null);

    // Categories (Same as AddBirthday)
    const categories = ['Family', 'GF', 'BF', 'Friends', 'Work', 'Teacher'];
    const categoryRelationships = {
        'Family': ['Mom', 'Dad', 'Brother', 'Sister', 'Son', 'Daughter', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Cousin'],
        'GF': ['True Love', 'Time Pass'],
        'BF': ['True Love', 'Time Pass'],
        'Friends': ['Best Friend', 'Close Friend', 'Friend', 'Childhood Friend', 'College Friend'],
        'Work': ['Boss', 'Colleague', 'Team Member', 'Manager', 'Subordinate', 'Client'],
        'Teacher': ['School Teacher', 'College Professor', 'Tuition Teacher', 'Mentor', 'Guide']
    };

    useEffect(() => {
        fetchBirthdayDetails();

        // Click Outside Listener
        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) setIsCategoryOpen(false);
            if (relationshipRef.current && !relationshipRef.current.contains(event.target)) setIsRelationshipOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [id]);

    const fetchBirthdayDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/birthdays`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const birthday = data.find(b => b._id === id);
                if (birthday) {
                    setFormData({
                        name: birthday.name,
                        whatsapp: birthday.whatsapp,
                        date: birthday.date.split('T')[0],
                        category: birthday.category,
                        relationship: birthday.relationship,
                        reminder: birthday.reminder,
                        reminderTime: birthday.reminderTime,
                        reminderDays: birthday.reminderDays,
                        amPm: birthday.amPm,
                        bio: birthday.bio || '',
                        instagram: birthday.instagram || ''
                    });
                    setPhotoPreview(birthday.photo);

                    // Calculate Extra Stats
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const birthDate = new Date(birthday.date);
                    const thisYear = today.getFullYear();

                    let nextBirthday = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
                    if (nextBirthday < today) {
                        nextBirthday = new Date(thisYear + 1, birthDate.getMonth(), birthDate.getDate());
                    }

                    const diffTime = nextBirthday - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    let age = today.getFullYear() - birthDate.getFullYear();
                    if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
                        age--;
                    }

                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const birthDayName = days[birthDate.getDay()];

                    setExtraStats({
                        age: age + 1, // Turning age
                        daysLeft: diffDays,
                        birthDayName: birthDayName
                    });
                } else {
                    alert('Birthday not found');
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/birthdays/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, photo: photoPreview })
            });

            if (response.ok) {
                setIsEditing(false);
                alert('Updated successfully!');
            } else {
                alert('Failed to update');
            }
        } catch (error) {
            console.error('Error updating:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/birthdays/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#63b0b8] font-bold">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 relative overflow-hidden font-sans pt-6 pb-10">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] right-0 w-[50vh] h-[50vh] bg-[#63b0b8] rounded-full blur-[120px] opacity-10"></div>
                <div className="absolute bottom-0 left-0 w-[40vh] h-[40vh] bg-[#A855F7] rounded-full blur-[100px] opacity-10"></div>
            </div>

            <div className="relative z-10 max-w-lg mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-700 hover:text-[#63b0b8] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </motion.button>
                    <h1 className="text-lg font-black text-gray-900 tracking-tight">
                        {isEditing ? 'Edit Profile' : 'Friend Profile'}
                    </h1>
                    {/* Toggle Edit/Cancel */}
                    {!isEditing ? (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsEditing(true)}
                            className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-700 hover:text-[#A855F7] transition-colors"
                        >
                            <Edit className="w-5 h-5" />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                setIsEditing(false);
                                fetchBirthdayDetails(); // Reset changes
                            }}
                            className="p-3 bg-red-50 rounded-2xl shadow-sm border border-red-100 text-red-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </motion.button>
                    )}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        /* EDIT MODE FORM */
                        <motion.form
                            key="edit-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onSubmit={handleUpdate}
                            className="space-y-6"
                        >
                            {/* Photo Upload */}
                            <div className="flex justify-center mb-8">
                                <div className="relative group cursor-pointer" onClick={() => document.getElementById('photoUpdate').click()}>
                                    <div className="w-32 h-32 rounded-[40px] bg-white shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-12 h-12 text-gray-300" />
                                        )}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <input id="photoUpdate" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 font-bold text-gray-900 focus:outline-none focus:border-[#63b0b8] focus:ring-1 focus:ring-[#63b0b8]"
                                        placeholder="Name"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Display Category</label>
                                    {/* Category Dropdown */}
                                    <div ref={categoryRef} className="relative">
                                        <div
                                            onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsRelationshipOpen(false); }}
                                            className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 font-bold text-gray-900 flex justify-between items-center cursor-pointer"
                                        >
                                            {formData.category || 'Select Category'}
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        </div>
                                        {isCategoryOpen && (
                                            <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                                {categories.map(cat => (
                                                    <div key={cat} onClick={() => { setFormData({ ...formData, category: cat, relationship: '' }); setIsCategoryOpen(false); }}
                                                        className={`px-5 py-3 font-bold hover:bg-gray-50 cursor-pointer ${formData.category === cat ? 'text-[#63b0b8]' : 'text-gray-600'}`}>
                                                        {cat}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Relationship</label>
                                    {/* Relationship Dropdown */}
                                    <div ref={relationshipRef} className="relative">
                                        <div
                                            onClick={() => { setIsRelationshipOpen(!isRelationshipOpen); setIsCategoryOpen(false); }}
                                            className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 font-bold text-gray-900 flex justify-between items-center cursor-pointer"
                                        >
                                            {formData.relationship || 'Select Relationship'}
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        </div>
                                        {isRelationshipOpen && (
                                            <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-y-auto max-h-48">
                                                {(categoryRelationships[formData.category] || []).map(rel => (
                                                    <div key={rel} onClick={() => { setFormData({ ...formData, relationship: rel }); setIsRelationshipOpen(false); }}
                                                        className={`px-5 py-3 font-bold hover:bg-gray-50 cursor-pointer ${formData.relationship === rel ? 'text-[#63b0b8]' : 'text-gray-600'}`}>
                                                        {rel}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 font-bold text-gray-900 focus:outline-none focus:border-[#63b0b8]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">WhatsApp</label>

                                    <input
                                        type="tel"
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 font-bold text-gray-900 focus:outline-none focus:border-[#63b0b8]"
                                        placeholder="+91..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Instagram (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.instagram}
                                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 font-bold text-gray-900 focus:outline-none focus:border-[#63b0b8]"
                                        placeholder="@username"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Bio / Note (Optional)</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 font-bold text-gray-900 focus:outline-none focus:border-[#63b0b8] min-h-[100px]"
                                        placeholder="Write something special..."
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-4 mt-8 bg-[#63b0b8] text-white rounded-2xl font-black text-lg shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Save Changes
                            </motion.button>
                        </motion.form>
                    ) : (
                        /* PROFILE VIEW MODE */
                        <motion.div
                            key="view-profile"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[40px] shadow-xl shadow-gray-100 border border-white overflow-hidden p-5 sm:p-8 relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#63b0b8]/10 to-[#A855F7]/10 z-0"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                {/* Large Profile Photo - Conic Gradient Animation */}
                                <div className="relative mb-6">
                                    <div className="relative p-[4px] rounded-[44px] overflow-hidden bg-white shadow-2xl shadow-gray-200 w-32 h-32 sm:w-40 sm:h-40">
                                        {/* Conic Gradient Background Animation */}
                                        <motion.div
                                            animate={{
                                                rotate: 360,
                                                background: [
                                                    "conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #63b0b8 280deg, #63b0b8 360deg)",
                                                    "conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #A855F7 280deg, #A855F7 360deg)",
                                                    "conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #111827 280deg, #111827 360deg)",
                                                    "conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #63b0b8 280deg, #63b0b8 360deg)"
                                                ]
                                            }}
                                            transition={{
                                                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                                background: { duration: 9, repeat: Infinity, ease: "linear" }
                                            }}
                                            className="absolute inset-[-150%] z-0"
                                        />

                                        {/* Image Container */}
                                        <div className="relative w-full h-full rounded-[40px] bg-white z-10 overflow-hidden border-4 border-white">
                                            <img
                                                src={photoPreview || "https://i.pravatar.cc/300"}
                                                alt={formData.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter mb-1 text-center capitalize">{formData.name}</h2>
                                <p className="text-[#63b0b8] font-bold text-sm tracking-widest uppercase mb-2">{formData.relationship}</p>

                                {/* Bio directly after Relationship */}
                                {formData.bio && (
                                    <p className="text-gray-500 text-sm font-medium italic mb-6 max-w-xs text-center leading-relaxed">
                                        "{formData.bio}"
                                    </p>
                                )}
                                {!formData.bio && <div className="mb-6"></div>}

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full mb-8">
                                    <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 text-center border border-gray-100">
                                        <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Birth Date</p>
                                        <p className="text-gray-900 font-black text-sm sm:text-lg">{new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 text-center border border-gray-100">
                                        <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Category</p>
                                        <p className="text-gray-900 font-black text-sm sm:text-lg">{formData.category}</p>
                                    </div>
                                </div>

                                {/* Extra Stats Grid */}
                                <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mb-6">
                                    <div className="bg-purple-50 rounded-2xl p-2 sm:p-3 text-center border border-purple-100">
                                        <p className="text-[9px] sm:text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1">Turning</p>
                                        <p className="text-gray-900 font-black text-base sm:text-xl">{extraStats.age}</p>
                                    </div>
                                    <div className="bg-orange-50 rounded-2xl p-2 sm:p-3 text-center border border-orange-100">
                                        <p className="text-[9px] sm:text-[10px] text-orange-400 font-bold uppercase tracking-widest mb-1">In Days</p>
                                        <p className="text-gray-900 font-black text-base sm:text-xl">{extraStats.daysLeft}</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-2xl p-2 sm:p-3 text-center border border-blue-100">
                                        <p className="text-[9px] sm:text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Born On</p>
                                        <p className="text-gray-900 font-black text-[10px] sm:text-sm pt-1">{extraStats.birthDayName}</p>
                                    </div>
                                </div>

                                {/* Bio Section Removed from here */}
                                {!formData.bio && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full py-3 mb-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-sm flex items-center justify-center gap-2 hover:border-[#63b0b8] hover:text-[#63b0b8] transition-all group"
                                    >
                                        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        Add Special Note / Bio
                                    </button>
                                )}

                                {/* Contact & Actions */}
                                <div className="w-full space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        {formData.whatsapp && (
                                            <a
                                                href={`https://wa.me/${formData.whatsapp.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-3 sm:py-4 bg-[#25D366]/10 text-[#25D366] rounded-2xl font-black text-sm sm:text-base hover:bg-[#25D366]/20 transition-colors"
                                            >
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-5 h-5" />
                                                WhatsApp
                                            </a>
                                        )}
                                        {formData.instagram ? (
                                            <a
                                                href={`https://instagram.com/${formData.instagram.replace('@', '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-3 sm:py-4 bg-[#E1306C]/10 text-[#E1306C] rounded-2xl font-black text-sm sm:text-base hover:bg-[#E1306C]/20 transition-colors"
                                            >
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="IG" className="w-5 h-5" />
                                                Instagram
                                            </a>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center justify-center gap-2 w-full py-3 sm:py-4 border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl font-black text-sm sm:text-base hover:border-[#E1306C] hover:text-[#E1306C] transition-all group"
                                            >
                                                Add Insta
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="IG" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center justify-center gap-2 w-full py-3 sm:py-4 text-red-400 font-bold text-sm sm:text-base hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Profile
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
};

export default BirthdayDetails;
