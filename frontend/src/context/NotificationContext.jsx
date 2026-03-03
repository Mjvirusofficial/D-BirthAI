import React, { createContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import NotificationToast from '../components/NotificationToast';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 3000);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed top-24 right-0 md:right-6 z-[10000] flex flex-col items-center md:items-end gap-3 w-full md:w-auto md:max-w-xs px-4 pointer-events-none">
                <div className="flex flex-col items-center md:items-end gap-3 pointer-events-auto w-full md:w-auto">
                    <AnimatePresence>
                        {notifications.map((n) => (
                            <NotificationToast
                                key={n.id}
                                message={n.message}
                                type={n.type}
                                onClose={() => removeNotification(n.id)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </NotificationContext.Provider>
    );
};
