import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Phone, Calendar, User } from 'lucide-react';

const BirthdayList = ({ birthdays, onDelete }) => {
    if (birthdays.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm"
            >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No Birthdays Yet</h3>
                <p className="text-gray-400">Add your first reminder to get started</p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
                {birthdays.map((birthday, index) => (
                    <motion.div
                        key={birthday._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="group relative bg-[#2d1b14] p-6 rounded-2xl border border-brand-orange/20 hover:border-brand-orange/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-orange/10 overflow-hidden"
                    >
                        {/* Stitching effect */}
                        <div className="absolute inset-2 border border-dashed border-white/10 rounded-xl pointer-events-none" />

                        <div className="absolute top-4 right-4 z-10">
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onDelete(birthday._id)}
                                className="p-2 rounded-xl bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white"
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.button>
                        </div>

                        <div className="flex items-start gap-4 mb-6 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-brand-accent flex items-center justify-center shadow-lg text-white font-bold text-xl border border-brand-gold/30">
                                {birthday.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-brand-cream mb-1">{birthday.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-brand-gold transition-colors">
                                    <Phone className="w-3 h-3" />
                                    {birthday.phone}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-2 text-brand-orange bg-brand-orange/10 px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wide">
                                <Calendar className="w-4 h-4" />
                                {new Date(birthday.dob).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default BirthdayList;
