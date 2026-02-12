import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };
                    const { data } = await axios.get(`${API_URL}/api/auth/me`, config);
                    setUser(data);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
    };

    const register = async (userData) => {
        const { data } = await axios.post(`${API_URL}/api/auth/register`, userData);
        localStorage.setItem('token', data.token);
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateUserProfile = async (userData) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.put(`${API_URL}/api/auth/profile`, userData, config);
        // Only update local user state if it's a profile update, not just a password change
        // But for profile update it returns new user data
        setUser(data);
        return data;
    };

    const changePassword = async (passwordData) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.put(`${API_URL}/api/auth/update-password`, passwordData, config);
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUserProfile, changePassword, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
