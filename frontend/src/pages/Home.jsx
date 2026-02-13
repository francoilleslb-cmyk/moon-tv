import { Link } from 'react-router-dom'
import { FiTv, FiFilm, FiMonitor, FiStar, FiPlay } from 'react-icons/fi'

export default function Home() {
  const features = [
    {
      icon: FiTv,
      title: 'TV en Vivo',
      description: 'Más de 500 canales en vivo de todo el mundo',
      link: '/channels',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FiFilm,
      title: 'Películas',
      description: 'Miles de películas en HD y 4K',
      link: '/movies',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: FiMonitor,
      title: 'Series',
      description: 'Las mejores series del momento',
      link: '/series',
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  const stats = [
    { number: '500+', label: 'Canales' },
    { number: '10K+', label: 'Películas' },
    { number: '5K+', label: 'Series' },
    { number: '100K+', label: 'Usuarios' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-900 to-primary-900/20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <span className="text-8xl animate-bounce">🌙</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-600 bg-clip-text text-transparent">
                Bienvenido a Moon TV
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-dark-300 mb-8 max-w-3xl mx-auto">
              Tu plataforma definitiva de streaming. TV en vivo, películas y series en un solo lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/channels"
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-glow transition-all duration-300 flex items-center space-x-2 group"
              >
                <FiPlay className="group-hover:scale-110 transition-transform" />
                <span>Comenzar Ahora</span>
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-dark-800 hover:bg-dark-700 rounded-xl font-semibold text-lg border-2 border-dark-700 hover:border-primary-600 transition-all duration-300"
              >
                Registrarse Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-dark-900 py-12 border-y border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-dark-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                Todo lo que necesitas
              </span>
            </h2>
            <p className="text-dark-400 text-lg">
              Entretenimiento ilimitado al alcance de tu mano
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link
                  key={index}
                  to={feature.link}
                  className="card group hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-dark-400 mb-4">{feature.description}</p>
                  <div className="flex items-center text-primary-500 font-medium group-hover:gap-2 transition-all">
                    <span>Explorar</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900/20 to-dark-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <FiStar className="text-6xl text-yellow-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-dark-300 mb-8">
            Únete a miles de usuarios que ya disfrutan de Moon TV
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-glow transition-all duration-300"
          >
            Crear Cuenta Gratis
          </Link>
        </div>
      </section>
    </div>
  )
}
