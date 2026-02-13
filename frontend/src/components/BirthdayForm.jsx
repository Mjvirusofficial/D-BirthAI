import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Calendar, Plus, Loader } from 'lucide-react';

const BirthdayForm = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate a small delay for better UX feel
        await new Promise(resolve => setTimeout(resolve, 500));
        await onAdd({ name, phone, dob });
        setName('');
        setPhone('');
        setDob('');
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="group">
                <label className="text-sm font-bold text-brand-gold mb-2 block uppercase tracking-wider">Full Name</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-orange transition-colors" />
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-[#2d1b14] border border-brand-orange/20 rounded-xl text-brand-cream placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all font-medium"
                        required
                    />
                </div>
            </div>

            <div className="group">
                <label className="text-sm font-bold text-brand-gold mb-2 block uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-orange transition-colors" />
                    <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-[#2d1b14] border border-brand-orange/20 rounded-xl text-brand-cream placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all font-medium"
                        required
                    />
                </div>
            </div>

            <div className="group">
                <label className="text-sm font-bold text-brand-gold mb-2 block uppercase tracking-wider">Date of Birth</label>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-orange transition-colors" />
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-[#2d1b14] border border-brand-orange/20 rounded-xl text-brand-cream placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all font-medium appearance-none"
                        required
                    />
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-gradient-to-r from-brand-orange to-brand-accent hover:from-brand-accent hover:to-brand-orange text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-orange/20 transition-all flex items-center justify-center gap-2 border border-brand-gold/20"
            >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Add Reminder'}
            </motion.button>
        </form>
    );
};

export default BirthdayForm;
