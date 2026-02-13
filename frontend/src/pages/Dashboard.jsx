import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Mic, Calendar, Gift, Star, Clock, ChevronRight, ChevronLeft, Cake, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import API_BASE_URL from '../apiConfig';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [birthdays, setBirthdays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const categories = ['All', 'Family', 'GF', 'BF', 'Friends', 'Work', 'Teacher'];

    // Fetch birthdays from API
    useEffect(() => {
        const fetchBirthdays = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/api/birthdays`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setBirthdays(data);
                }
            } catch (error) {
                console.error('Error fetching birthdays:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBirthdays();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this birthday?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/birthdays/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setBirthdays(birthdays.filter(b => b._id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting birthday:', error);
            alert('Error deleting birthday');
        }
    };

    // Filter and Calculate days
    // Process all birthdays first to add metadata
    const processedBirthdays = birthdays.map(birthday => {
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

        // Age Calculation
        let ageYears = today.getFullYear() - birthDate.getFullYear();
        let lastBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

        if (today < lastBirthday) {
            ageYears--;
        }

        // Calculate age days precisely
        let previousBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (today < previousBirthday) {
            previousBirthday = new Date(today.getFullYear() - 1, birthDate.getMonth(), birthDate.getDate());
        }
        const ageDays = Math.floor((today - previousBirthday) / (1000 * 60 * 60 * 24));

        return {
            id: birthday._id,
            name: birthday.name,
            whatsapp: birthday.whatsapp,
            dateRaw: birthDate,
            date: birthDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            age: { years: ageYears, days: ageDays },
            relationship: birthday.relationship,
            category: birthday.category,
            days: diffDays,
            photo: birthday.photo,
            color: diffDays === 0 ? 'from-[#EC4899]/10 to-[#EC4899]/5' : 'from-[#63b0b8]/10 to-[#63b0b8]/5',
            borderColor: 'border-[#63b0b8]/20',
            iconColor: 'text-[#63b0b8]'
        };
    });

    // 1. Get One Nearest Upcoming Birthday (Global)
    const upcomingBirthday = processedBirthdays
        .slice()
        .sort((a, b) => a.days - b.days)[0];

    // 2. Filter and Sort for List
    const filteredBirthdays = processedBirthdays
        .filter(b => {
            const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (b.relationship && b.relationship.toLowerCase().includes(searchQuery.toLowerCase()));
            if (selectedCategory === 'All') return matchesSearch;
            const matchesCategory = b.category === selectedCategory;

            if (searchQuery) return matchesSearch;
            return matchesCategory;
        })
        .sort((a, b) => a.days - b.days);

    // Pagination Logic
    const totalPages = Math.ceil(filteredBirthdays.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBirthdays.slice(indexOfFirstItem, indexOfLastItem);

    // Reset page when category or search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    // Scroll to top of list section when page changes
    useEffect(() => {
        const listSection = document.getElementById('birthday-list-section');
        if (listSection) {
            listSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

    return (
        <div className="min-h-screen bg-white pt-28 pb-32 px-4 font-sans relative overflow-hidden">
            {/* Animated Background Elements */}
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
                {/* Compact Right-Aligned Header Pill */}
                <div className="flex justify-end mb-12 px-2 pt-2">
                    <Link to="/profile">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] px-4 py-2 rounded-full cursor-pointer group"
                        >
                            <div className="text-right">
                                <h2 className="text-sm font-black text-gray-800 tracking-tight leading-none group-hover:text-[#63b0b8] transition-colors">
                                    Hey <span className="text-[#63b0b8]">{user?.name?.split(' ')[0] || "User"}</span>! ✨
                                </h2>
                            </div>
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-1 bg-gradient-to-tr from-[#63b0b8] via-[#A855F7] to-[#FDE047] rounded-full opacity-70 blur-[2px]"
                                />
                                <div className="relative w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden shadow-sm border border-brand-teal/20">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                            <span className="text-base font-black text-[#63b0b8]">{user?.name?.charAt(0) || "U"}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* Latest Birthday Section */}
                {upcomingBirthday && (
                    <section className="mb-8 sm:mb-10">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-gray-900 font-black tracking-tight text-base sm:text-lg">Latest Celebration</h2>
                            <span className="text-[10px] sm:text-xs font-bold text-[#A855F7] uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full animate-pulse">Coming Fast</span>
                        </div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={() => navigate(`/birthday/${upcomingBirthday.id}`)}
                            className="relative group cursor-pointer"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#63b0b8] via-[#A855F7] to-[#EC4899] rounded-[32px] sm:rounded-[40px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                            <div className="relative bg-white rounded-[28px] sm:rounded-[32px] p-4 sm:p-6 flex items-center justify-between shadow-xl border border-gray-50 overflow-hidden">
                                <div className="absolute -right-10 -bottom-10 w-32 h-32 sm:w-40 sm:h-40 bg-[#63b0b8]/10 rounded-full blur-3xl" />

                                <div className="flex items-center gap-3 sm:gap-5 relative">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                            className="absolute -inset-1 bg-gradient-to-tr from-[#63b0b8] via-[#A855F7] to-[#FDE047] rounded-full blur-[1px] opacity-70"
                                        />
                                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[24px] bg-white p-0.5 sm:p-1 border-2 border-white shadow-lg overflow-hidden flex items-center justify-center">
                                            {upcomingBirthday.photo ? (
                                                <img src={upcomingBirthday.photo} alt={upcomingBirthday.name} className="w-full h-full object-cover rounded-[14px] sm:rounded-[18px]" />
                                            ) : (
                                                <Cake className="w-8 h-8 text-[#A855F7]" />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-xl font-black text-gray-900 tracking-tighter leading-none">{upcomingBirthday.name}</h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1.5 sm:mt-2">
                                            <p className="text-[#A855F7] text-[10px] sm:text-xs font-black uppercase tracking-widest bg-purple-50 w-fit px-2 py-0.5 rounded-lg border border-purple-100">
                                                {upcomingBirthday.date}
                                            </p>
                                            <p className="text-gray-400 text-[10px] sm:text-xs font-bold flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {upcomingBirthday.days === 0 ? "Today!" : `In ${upcomingBirthday.days} days`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (upcomingBirthday.whatsapp) {
                                            const message = `Happy Birthday ${upcomingBirthday.name.split(' ')[0]}! 🎂🎉 Have a great day!`;
                                            const url = `https://wa.me/${upcomingBirthday.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
                                            window.open(url, '_blank');
                                        } else {
                                            alert('No WhatsApp number found for this contact.');
                                        }
                                    }}
                                    className="bg-[#63b0b8] text-white text-[10px] sm:text-sm font-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-[16px] sm:rounded-2xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all border border-white/20 whitespace-nowrap ml-2"
                                >
                                    Send Wish
                                </motion.button>
                            </div>
                        </motion.div>
                    </section>
                )}

                {/* Ultra-Refined Search Bar */}
                <div className="relative mb-8 sm:mb-10 px-1">
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#63b0b8]/10 via-transparent to-[#A855F7]/10 rounded-[35px] blur-xl opacity-50 pointer-events-none" />

                    <div className="relative flex items-center bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[24px] sm:rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group">
                        <div className="pl-5 sm:pl-7 pr-2 sm:pr-3 flex items-center justify-center text-gray-400 group-focus-within:text-[#63b0b8] transition-colors duration-300">
                            <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                        </div>

                        <input
                            type="text"
                            placeholder="Find a celebration..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent py-3.5 sm:py-5 text-gray-900 font-bold placeholder:text-gray-300 focus:outline-none text-sm sm:text-base tracking-tight"
                        />

                        <div className="pr-2 sm:pr-3 py-1.5 sm:py-2">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 176, 184, 0.1)' }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gray-50/50 border border-gray-100/50 group/mic transition-all duration-200"
                            >
                                <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover/mic:text-[#63b0b8] transition-colors" />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Responsive Category Slider */}
                <div className="relative mb-10 overflow-x-auto no-scrollbar scroll-smooth">
                    <div className="flex gap-3 py-2 min-w-max px-1">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-3.5 rounded-2xl text-[10px] sm:text-xs md:text-sm font-black tracking-tight whitespace-nowrap transition-all border flex items-center justify-center ${selectedCategory === cat
                                    ? 'bg-[#A855F7] text-white border-transparent shadow-lg shadow-purple-200'
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-[#A855F7]/30 shadow-sm'
                                    }`}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Refined Upcoming List */}
                <section id="birthday-list-section" className="mt-4">
                    <div className="flex items-center justify-between mb-6 px-3">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-[#A855F7] fill-[#A855F7]/20" />
                            <h2 className="text-gray-900 font-black tracking-tight text-lg sm:text-xl">
                                {selectedCategory} Celebrations
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-4 px-1">
                        <AnimatePresence mode="wait">
                            {currentItems.length > 0 ? (
                                <motion.div
                                    key={selectedCategory + currentPage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    {currentItems.map((bday, i) => (
                                        <motion.div
                                            key={bday.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => navigate(`/birthday/${bday.id}`)}
                                            className="relative group cursor-pointer"
                                        >
                                            <div className="absolute -inset-1 bg-gradient-to-r from-[#A855F7] via-[#63b0b8] to-[#EC4899] rounded-[28px] blur-md opacity-20 group-hover:opacity-35 transition-opacity" />
                                            <div className="relative bg-white rounded-[24px] p-4 flex items-center justify-between border border-white shadow-xl overflow-hidden">
                                                <div className={`absolute -right-6 -bottom-6 w-20 h-20 bg-gradient-to-br ${bday.color} rounded-full blur-2xl opacity-30`} />

                                                <div className="flex items-center gap-4 relative">
                                                    <div className="relative">
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                            className="absolute -inset-1 bg-gradient-to-tr from-[#63b0b8] via-[#A855F7] to-[#FDE047] rounded-full blur-[1px] opacity-70"
                                                        />
                                                        <div className="relative w-12 h-12 rounded-[18px] bg-white p-0.5 border-2 border-white shadow-lg overflow-hidden flex items-center justify-center">
                                                            {bday.photo ? (
                                                                <img src={bday.photo} alt={bday.name} className="w-full h-full object-cover rounded-[14px]" />
                                                            ) : (
                                                                <Cake className="w-6 h-6 text-[#A855F7]" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-black text-gray-900 tracking-tight leading-none mb-1.5">{bday.name.toUpperCase()}</h4>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-[9.5px] font-black text-[#A855F7] bg-purple-50/50 px-2.5 py-1 rounded-lg border border-purple-100/50 shadow-sm flex items-center gap-1.5">
                                                                <Clock className="w-2.5 h-2.5" />
                                                                {bday.age.years}Y {bday.age.days}D Old
                                                            </span>
                                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg text-gray-400 bg-gray-50 border border-gray-100 shadow-sm">
                                                                {bday.relationship}
                                                            </span>
                                                            <span className="text-[9px] font-black text-[#63b0b8] bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100 shadow-sm flex items-center justify-center">
                                                                {bday.date}
                                                            </span>
                                                            <motion.button
                                                                whileHover={{ scale: 1.2, color: '#ef4444' }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(bday.id);
                                                                }}
                                                                className="p-1.5 text-gray-300 hover:text-red-500 transition-colors bg-gray-50/50 rounded-lg border border-gray-100/50 ml-1"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right flex items-center gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <p className="text-xs font-black text-[#A855F7] tracking-tighter leading-none">{bday.days} Days</p>
                                                        <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mt-0.5">Left</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100"
                                >
                                    <p className="text-gray-400 font-bold">No birthdays found in {selectedCategory}</p>
                                    <Link to="/add-birthday" className="text-[#A855F7] text-xs font-black uppercase tracking-widest mt-2 block hover:underline">+ Add One Now</Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-10">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className={`p-3 rounded-2xl border shadow-sm transition-all ${currentPage === 1 ? 'bg-gray-50 text-gray-300 border-gray-100' : 'bg-white text-[#A855F7] border-purple-100 hover:border-[#A855F7]'}`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </motion.button>

                            <div className="flex items-center gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#A855F7] text-white' : 'bg-white text-gray-400 border border-gray-100 hover:border-[#A855F7]/30'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className={`p-3 rounded-2xl border shadow-sm transition-all ${currentPage === totalPages ? 'bg-gray-50 text-gray-300 border-gray-100' : 'bg-white text-[#A855F7] border-purple-100 hover:border-[#A855F7]'}`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    )}
                </section>
            </div>

            {/* Refined Add Button */}
            <div className="fixed bottom-10 right-8 z-50">
                <Link to="/add-birthday" className="relative block group">
                    <motion.div
                        className="relative p-[3px] rounded-[24px] overflow-hidden cursor-pointer"
                        initial={{ scale: 0, y: 50 }}
                        animate={{
                            scale: 1,
                            y: 0,
                            boxShadow: [
                                "0 10px 40px rgba(99, 176, 184, 0.4)",
                                "0 10px 40px rgba(168, 85, 247, 0.4)",
                                "0 10px 40px rgba(17, 24, 39, 0.4)",
                                "0 10px 40px rgba(99, 176, 184, 0.4)"
                            ]
                        }}
                        transition={{
                            type: "spring",
                            damping: 15,
                            stiffness: 300,
                            boxShadow: { duration: 9, repeat: Infinity, ease: "linear" }
                        }}
                    >
                        {/* Dynamic Border Animation - Faster & Refined */}
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

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl w-16 h-16 rounded-[21px] z-10 overflow-hidden border border-gray-100/10"
                        >
                            <motion.div
                                animate={{ color: ['#63b0b8', '#A855F7', '#111827', '#63b0b8'] }}
                                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                                className="mt-1"
                            >
                                <Cake className="w-7 h-7" strokeWidth={2.5} />
                            </motion.div>
                            <motion.span
                                animate={{ color: ['#63b0b8', '#A855F7', '#111827', '#63b0b8'] }}
                                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                                className="font-black text-[9px] uppercase tracking-tighter mt-1"
                            >
                                Add
                            </motion.span>
                        </motion.button>
                    </motion.div>

                    {/* Plus Badge with Dynamic Background */}
                    <motion.div
                        animate={{ backgroundColor: ['#63b0b8', '#A855F7', '#111827', '#63b0b8'] }}
                        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1.5 -right-1.5 rounded-full p-1 border-2 border-white shadow-lg transition-transform group-hover:scale-110 z-[60]"
                    >
                        <Plus className="w-3 h-3 text-white" strokeWidth={5} />
                    </motion.div>
                </Link>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default Dashboard;
