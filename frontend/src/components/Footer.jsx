import { Link } from 'react-router-dom'
import { FiHeart, FiGithub, FiTwitter, FiFacebook } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🌙</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Moon TV
              </span>
            </div>
            <p className="text-dark-400 mb-4">
              Tu plataforma de streaming favorita. Disfruta de TV en vivo, películas y series en cualquier momento y lugar.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors">
                <FiGithub size={20} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-dark-400 hover:text-primary-500 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/channels" className="text-dark-400 hover:text-primary-500 transition-colors">
                  TV en Vivo
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-dark-400 hover:text-primary-500 transition-colors">
                  Películas
                </Link>
              </li>
              <li>
                <Link to="/series" className="text-dark-400 hover:text-primary-500 transition-colors">
                  Series
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="text-white font-semibold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors">
                  Acerca de
                </a>
              </li>
              <li>
                <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors">
                  Términos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-dark-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Moon TV. Todos los derechos reservados.
          </p>
          <p className="text-dark-400 text-sm flex items-center">
            Hecho con <FiHeart className="text-red-500 mx-1" /> por Moon TV Team
          </p>
        </div>
      </div>
    </footer>
  )
}
