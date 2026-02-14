import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API URL (Adjust based on your environment)
// Using the production URL provided by user
const API_URL = 'https://moon-tv-dmws.onrender.com'; 

// Configure axios base URL
axios.defaults.baseURL = API_URL;

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  isInitialized: false,

  // Initialize auth state from storage
  init: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ 
          token, 
          user: user ? JSON.parse(user) : null,
          isInitialized: true 
        });
      } else {
        set({ isInitialized: true });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isInitialized: true });
    }
  },

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      const userStr = JSON.stringify(data.user);
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', userStr);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      set({ error: message, loading: false });
      return false;
    }
  },

  // Register
  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });
      
      const userStr = JSON.stringify(data.user);
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', userStr);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrarse';
      set({ error: message, loading: false });
      return false;
    }
  },

  // Logout
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      set({ user: null, token: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
}));

export default useAuthStore;
