import React, { useEffect, useState, useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Trash, Shield, User, Lock, Database, ArrowLeft, Eye, X, Calendar, Search, RefreshCcw, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { token, user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userBirthdays, setUserBirthdays] = useState([]);
    const [birthdaysLoading, setBirthdaysLoading] = useState(false);
    const [whatsappStatus, setWhatsappStatus] = useState({ status: 'loading', qr: null });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchWhatsAppStatus();
        const interval = setInterval(fetchWhatsAppStatus, 5000); // Poll status every 5s
        return () => clearInterval(interval);
    }, []);

    const fetchWhatsAppStatus = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/whatsapp-status`, {
                headers: { 'x-auth-token': token }
            });
            setWhatsappStatus(response.data);
        } catch (err) {
            console.error('Failed to fetch whatsapp status', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
                headers: { 'x-auth-token': token }
            });
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Access Denied or Failed to fetch users');
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user and all their data?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/user/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setUsers(users.filter(u => u._id !== id));
            showNotification('User deleted successfully', 'success');
        } catch (err) {
            showNotification('Failed to delete user', 'error');
        }
    };

    const handleViewData = async (user) => {
        setSelectedUser(user);
        setBirthdaysLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/user/${user._id}/birthdays`, {
                headers: { 'x-auth-token': token }
            });
            setUserBirthdays(response.data);
        } catch (err) {
            console.error(err);
            showNotification('Failed to fetch user data', 'error');
        } finally {
            setBirthdaysLoading(false);
        }
    };

    // Calculate Stats
    const totalUsers = users.length;
    const totalBirthdays = users.reduce((acc, user) => acc + (user.birthdayCount || 0), 0);
    const adminsCount = users.filter(u => u.isAdmin).length;

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <LoadingScreen />;

    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-500 font-bold p-4">
            {error}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 pt-24 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-500">Manage users and view system stats</p>
                        </div>
                    </div>

                    <Link to="/dashboard" className="px-5 py-3 bg-white text-gray-700 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 border border-gray-100">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-indigo-50 flex items-center gap-4 transition-all hover:scale-[1.02]">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Total Users</p>
                            <h2 className="text-4xl font-black text-gray-900 leading-none">{totalUsers}</h2>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-green-50 flex items-center gap-4 transition-all hover:scale-[1.02]">
                        <div className="p-4 bg-green-50 text-green-600 rounded-2xl shadow-inner">
                            <Database className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Global Records</p>
                            <h2 className="text-4xl font-black text-gray-900 leading-none">{totalBirthdays}</h2>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-purple-50 flex items-center gap-4 transition-all hover:scale-[1.02]">
                        <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shadow-inner">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">System Admins</p>
                            <h2 className="text-4xl font-black text-gray-900 leading-none">{adminsCount}</h2>
                        </div>
                    </div>
                    {/* WhatsApp Status Card */}
                    <div className={`p-6 rounded-3xl shadow-xl border flex items-center gap-4 transition-all hover:scale-[1.02] ${whatsappStatus.status === 'connected' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                        <div className={`p-4 rounded-2xl shadow-inner ${whatsappStatus.status === 'connected' ? 'bg-white text-emerald-600' : 'bg-white text-amber-600'}`}>
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">WhatsApp Link</p>
                            <div className="flex items-center gap-2">
                                <h2 className={`text-xl font-black leading-none ${whatsappStatus.status === 'connected' ? 'text-emerald-700' : 'text-amber-700'}`}>
                                    {whatsappStatus.status === 'connected' ? 'READY ✅' : whatsappStatus.status === 'qr_ready' ? 'SCAN QR 📲' : 'WAIT... ⏳'}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Controller */}
                {whatsappStatus.status === 'qr_ready' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[40px] shadow-2xl p-4 sm:p-10 mb-10 border-4 border-amber-200 relative overflow-hidden flex flex-col md:flex-row items-center gap-10"
                    >
                        <div className="relative z-10 text-center md:text-left md:flex-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full font-black text-xs uppercase tracking-widest mb-4">
                                <AlertCircle className="w-4 h-4" /> Action Required
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight">Link WhatsApp Client</h2>
                            <p className="text-gray-600 text-lg mb-6">Scan manually from your terminal or here to enable automated birthday wishes. System is waiting for authentication.</p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-700 font-bold">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">1</div>
                                    Open WhatsApp on your phone
                                </div>
                                <div className="flex items-center gap-3 text-gray-700 font-bold">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">2</div>
                                    Go to Settings {'>'} Linked Devices
                                </div>
                                <div className="flex items-center gap-3 text-gray-700 font-bold">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">3</div>
                                    Scan this code to link
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 bg-white p-6 rounded-[40px] shadow-2xl border-2 border-gray-100 min-w-[280px]">
                            <div className="w-64 h-64 bg-white rounded-3xl flex items-center justify-center border-4 border-amber-100 shadow-inner overflow-hidden">
                                <img
                                    src={`${API_BASE_URL}/qr.png?t=${new Date().getTime()}`}
                                    alt="Scan to link WhatsApp"
                                    className="w-full h-full object-contain p-2"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                <div style={{ display: 'none' }} className="text-gray-400 font-bold text-center p-4">
                                    <RefreshCcw className="w-8 h-8 mx-auto mb-2 animate-spin-slow" />
                                    Loading QR Code...
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Users List Title & Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3 self-start">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                        <h2 className="text-2xl font-black text-gray-900">Registered Users ({filteredUsers.length})</h2>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find user by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-bold text-gray-900 placeholder-gray-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {filteredUsers.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white rounded-[40px] shadow-xl shadow-gray-50 border border-gray-50">
                            <Search className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                            <p className="text-gray-400 font-black text-xl">No users found for "{searchQuery}"</p>
                        </div>
                    ) : (
                        filteredUsers.map((userData) => (
                            <motion.div
                                key={userData._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col justify-between h-full"
                            >
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-indigo-50">
                                            {userData.avatar ? (
                                                <img src={userData.avatar} className="w-full h-full object-cover" alt="avatar" />
                                            ) : (
                                                <span className="text-2xl font-black text-gray-400">{userData.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{userData.name}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-1">{userData.email}</p>
                                            {userData.isAdmin && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold mt-1 inline-block">Admin</span>}
                                        </div>
                                    </div>

                                    <div className="space-y-3 bg-gray-50 p-4 rounded-2xl mb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Database className="w-4 h-4" />
                                                <span className="text-sm font-semibold">Data Added</span>
                                            </div>
                                            <span className="font-black text-indigo-600">{userData.birthdayCount} Records</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Lock className="w-4 h-4" />
                                                <span className="text-sm font-semibold">Hashed Password</span>
                                            </div>
                                            <code className="text-[10px] bg-white p-2 rounded border border-gray-200 text-gray-400 break-all line-clamp-2" title={userData.password}>
                                                {userData.password.substring(0, 20)}...
                                            </code>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleViewData(userData)}
                                        className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Data
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(userData._id)}
                                        className="p-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center"
                                        title="Delete User"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* View Data Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setSelectedUser(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[32px] p-8 w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                                        {selectedUser.avatar ? (
                                            <img src={selectedUser.avatar} className="w-full h-full object-cover rounded-full" alt="avatar" />
                                        ) : (
                                            <span className="text-xl font-black text-indigo-400">{selectedUser.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">{selectedUser.name}'s Data</h2>
                                        <p className="text-gray-500 text-sm">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {birthdaysLoading ? (
                                    <div className="flex justify-center p-10">
                                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : userBirthdays.length === 0 ? (
                                    <div className="text-center p-10 text-gray-400">
                                        <Database className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No data added by this user yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {userBirthdays.map((birthday, i) => (
                                            <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-2xl">
                                                    {birthday.photo ? (
                                                        <img src={birthday.photo} className="w-full h-full object-cover rounded-xl" alt="bday" />
                                                    ) : (
                                                        "🎂"
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-800 truncate">{birthday.name}</h4>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-medium">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(birthday.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                        </div>
                                                        {birthday.whatsapp && (
                                                            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-md font-medium truncate">
                                                                {birthday.whatsapp}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1 mt-1">
                                                        {birthday.relationship && <span className="text-[10px] border border-gray-200 text-gray-400 px-1.5 rounded uppercase font-bold">{birthday.relationship}</span>}
                                                        {birthday.category && <span className="text-[10px] border border-gray-200 text-gray-400 px-1.5 rounded uppercase font-bold">{birthday.category}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
