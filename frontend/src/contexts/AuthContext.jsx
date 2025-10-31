import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Set base URL for axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Set up axios interceptor for auth
    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                console.log('Token set in headers');
            } else {
                delete axios.defaults.headers.common['Authorization'];
            }
            setLoading(false);
        };

        initializeAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            console.log('🔐 Making login request to:', `/api/auth/login`);
            console.log('📧 Login attempt with email:', email);

            const response = await axios.post('/api/auth/login', { 
                email, 
                password 
            });
            
            console.log('✅ Login successful:', response.data);
            const { token: newToken, user: userData } = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);

            return { success: true, user: userData };
        } catch (error) {
            console.error('❌ Login failed:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });

            let errorMessage = 'Login failed. ';
            
            if (error.response) {
                errorMessage += error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage += 'Cannot connect to server. Please check if backend is running on port 5000.';
            } else {
                errorMessage += error.message;
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            console.log('👤 Registering user:', { name, email });

            const response = await axios.post('/api/auth/register', {
                name,
                email,
                password
            });

            console.log('✅ Registration response:', response.data);

            const { token: newToken, user: userData } = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);

            return { success: true };
        } catch (error) {
            console.error('❌ Registration error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user && !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};