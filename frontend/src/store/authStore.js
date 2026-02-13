import { create } from 'zustand'
import axios from 'axios'
import { toast } from 'react-toastify'

// Configurar axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data } = await axios.post('/api/auth/login', { email, password })
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Configurar token en headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      
      set({ user: data.user, token: data.token, loading: false })
      toast.success('¡Bienvenido a Moon TV!')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión'
      set({ error: message, loading: false })
      toast.error(message)
      return false
    }
  },

  // Register
  register: async (username, email, password) => {
    set({ loading: true, error: null })
    try {
      const { data } = await axios.post('/api/auth/register', {
        username,
        email,
        password
      })
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      
      set({ user: data.user, token: data.token, loading: false })
      toast.success('¡Cuenta creada exitosamente!')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrarse'
      set({ error: message, loading: false })
      toast.error(message)
      return false
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    set({ user: null, token: null })
    toast.info('Sesión cerrada')
  },

  // Actualizar perfil
  updateProfile: async (updates) => {
    set({ loading: true, error: null })
    try {
      const { data } = await axios.put('/api/auth/update-profile', updates)
      
      localStorage.setItem('user', JSON.stringify(data.user))
      set({ user: data.user, loading: false })
      toast.success('Perfil actualizado')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar perfil'
      set({ error: message, loading: false })
      toast.error(message)
      return false
    }
  },

  // Inicializar autenticación
  init: () => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }
}))

// Inicializar al cargar
useAuthStore.getState().init()

export default useAuthStore
