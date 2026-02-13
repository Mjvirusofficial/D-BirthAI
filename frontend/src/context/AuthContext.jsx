import React, { createContext, useState, useEffect } from 'react';
import API_BASE_URL from '../apiConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async (authToken) => {
        try {
            console.log("Fetching user with token:", authToken);
            const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
                headers: {
                    'x-auth-token': authToken
                }
            });
            console.log("Fetch user response status:", response.status);

            if (response.ok) {
                const userData = await response.json();
                console.log("User data fetched successfully:", userData);
                setUser(userData);
            } else {
                console.error("Fetch user failed with status:", response.status);
                const errorData = await response.json();
                console.error("Error details:", errorData);
                logout();
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = (authToken) => {
        localStorage.setItem('token', authToken);
        setToken(authToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};
