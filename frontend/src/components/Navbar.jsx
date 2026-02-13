import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { FiMenu, FiX, FiUser, FiLogOut, FiTv, FiFilm, FiMonitor } from 'react-icons/fi'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const navLinks = [
    { path: '/', label: 'Inicio', icon: FiMonitor },
    { path: '/channels', label: 'TV en Vivo', icon: FiTv },
    { path: '/movies', label: 'Películas', icon: FiFilm },
    { path: '/series', label: 'Series', icon: FiFilm },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-dark-900 border-b border-dark-800 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-4xl group-hover:scale-110 transition-transform">
              🌙
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Moon TV
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary-600 text-white'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                >
                  <FiUser className="text-primary-400" />
                  <span className="text-sm font-medium">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <FiLogOut />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors font-medium shadow-lg hover:shadow-glow"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-dark-800 bg-dark-900">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-600 text-white'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}

            <div className="pt-4 border-t border-dark-800 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                  >
                    <FiUser className="text-primary-400 text-xl" />
                    <span className="font-medium">{user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <FiLogOut className="text-xl" />
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors text-center font-medium"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors text-center font-medium"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
