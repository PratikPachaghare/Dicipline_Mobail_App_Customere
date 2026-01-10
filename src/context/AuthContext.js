import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyToken } from '../utils/apiCalls';

// Replace with your actual backend URL (Use your IP if testing on device, e.g., http://192.168.1.5:8000)
const API_URL = 'http://10.0.2.2:8000/api'; 

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 App start: Check Token & Verify with Backend
useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        console.log('Stored Token:', storedToken);

        if (storedToken) {
          const response = await verifyToken('GET', '/auth/verify', storedToken);
          console.log('Token Verification Response:', response);

          // FIX IS HERE: Check response.data directly
          if (response && response.data && response.data.success) {
            
            // ✅ Success: Data is already inside response.data
            // DO NOT USE: await response.json(); 
            
            const freshUser = response.data.user; // Get user directly

            setToken(storedToken);
            setUser(freshUser);
            
            await AsyncStorage.setItem('user', JSON.stringify(freshUser));
          } else {
            console.log('Token expired or invalid');
            await logout(); 
          }
        }
      } catch (err) {
        console.log('Auth Load Error:', err);
        // If it is a network error, maybe don't logout immediately?
        // But for safety, logout is fine.
        await logout();
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // ✅ Login
  const login = async ({ token, user }) => {
    setToken(token);
    setUser(user);
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
  };

  // 🚪 Logout
  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');s
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}