import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X, Bell } from 'lucide-react';

const NotificationToast = ({ message, type, onClose }) => {
    const config = {
        success: {
            icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
            bgColor: 'bg-white/80',
            borderColor: 'border-emerald-100/50',
            barColor: 'bg-emerald-500',
            glowColor: 'rgba(16, 185, 129, 0.1)',
            shadow: 'shadow-emerald-500/10'
        },
        error: {
            icon: <XCircle className="w-5 h-5 text-red-500" />,
            bgColor: 'bg-white/80',
            borderColor: 'border-red-100/50',
            barColor: 'bg-red-500',
            glowColor: 'rgba(239, 68, 68, 0.1)',
            shadow: 'shadow-red-500/10'
        },
        info: {
            icon: <Bell className="w-5 h-5 text-blue-500" />,
            bgColor: 'bg-white/80',
            borderColor: 'border-blue-100/50',
            barColor: 'bg-blue-500',
            glowColor: 'rgba(59, 130, 246, 0.1)',
            shadow: 'shadow-blue-500/10'
        }
    };

    const style = config[type] || config.info;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9, filter: 'blur(5px)' }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 50, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`relative flex items-center gap-3 p-3 pr-10 rounded-[16px] border border-white/60 ${style.bgColor} shadow-xl ${style.shadow} backdrop-blur-3xl group overflow-hidden w-full md:w-auto`}
            style={{
                boxShadow: `0 15px 30px -10px rgba(0,0,0,0.1)`,
                minWidth: '240px',
                maxWidth: 'calc(100vw - 32px)'
            }}
        >
            {/* liquid glow removed for cleaner 'small rectangular' look */}

            <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl ${style.barColor} bg-opacity-[0.12] border border-white/50 flex items-center justify-center shadow-inner`}>
                {style.icon}
            </div>

            <div className="flex flex-col min-w-0 pr-2">
                <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${style.barColor.replace('bg-', 'text-')} mb-0.5 opacity-70`}>
                    {type}
                </span>
                <p className="text-[13px] font-black text-gray-800 tracking-tight leading-tight truncate">
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-2xl hover:bg-gray-100/60 text-gray-400 hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Premium Progress Loader */}
            <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-gray-100/10 overflow-hidden">
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className={`h-full ${style.barColor}`}
                    style={{ filter: 'brightness(1.1)' }}
                />
            </div>
        </motion.div>
    );
};

export default NotificationToast;
