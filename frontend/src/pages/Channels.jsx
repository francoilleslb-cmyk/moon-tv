import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FiSearch, FiFilter, FiTv, FiLoader } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function Channels() {
  const [channels, setChannels] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Cargar categorías
  useEffect(() => {
    fetchCategories()
  }, [])

  // Cargar canales
  useEffect(() => {
    fetchChannels()
  }, [selectedCategory, page])

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/channels/categories')
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error cargando categorías:', error)
    }
  }

  const fetchChannels = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 24,
        ...(selectedCategory && { category: selectedCategory })
      }
      
      const { data } = await axios.get('/api/channels', { params })
      setChannels(data.channels || [])
      setTotalPages(data.pages || 1)
    } catch (error) {
      toast.error('Error cargando canales')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      const { data } = await axios.get('/api/channels/search', {
        params: { q: searchTerm, limit: 24 }
      })
      setChannels(data.channels || [])
      setSelectedCategory('')
    } catch (error) {
      toast.error('Error en la búsqueda')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setPage(1)
    setSearchTerm('')
  }

  return (
    <div className="min-h-screen bg-dark-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <FiTv className="text-primary-500" />
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              TV en Vivo
            </span>
          </h1>
          <p className="text-dark-400 text-lg">
            {channels.length} canales disponibles
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar canales..."
              className="w-full px-6 py-4 pl-14 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
            />
            <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-dark-400 text-xl" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FiFilter className="text-primary-500 text-xl" />
            <h2 className="text-xl font-semibold">Categorías</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === ''
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              }`}
            >
              Todos ({categories.reduce((acc, cat) => acc + cat.count, 0)})
            </button>
            
            {categories.slice(0, 15).map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryChange(category.name)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.name
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Channels Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FiLoader className="text-6xl text-primary-500 animate-spin" />
          </div>
        ) : channels.length === 0 ? (
          <div className="text-center py-20">
            <FiTv className="text-6xl text-dark-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-dark-400 mb-2">
              No se encontraron canales
            </h3>
            <p className="text-dark-500">
              Intenta con otra búsqueda o categoría
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {channels.map((channel) => (
                <Link
                  key={channel._id}
                  to={`/channels/${channel._id}`}
                  className="channel-card group"
                >
                  <div className="aspect-video bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center relative overflow-hidden">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <FiTv className="text-6xl text-dark-600 group-hover:text-primary-500 transition-colors" />
                    )}
                    
                    {/* Live Badge */}
                    {channel.is24x7 && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-xs font-bold rounded-md flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        LIVE
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary-400 transition-colors line-clamp-1">
                      {channel.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="category-badge text-xs">
                        {channel.category}
                      </span>
                      {channel.quality && (
                        <span className="text-xs text-dark-400 font-medium">
                          {channel.quality}
                        </span>
                      )}
                    </div>
                    {channel.viewCount > 0 && (
                      <p className="text-xs text-dark-500 mt-2">
                        {channel.viewCount.toLocaleString()} vistas
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          page === pageNum
                            ? 'bg-primary-600 text-white shadow-glow'
                            : 'bg-dark-800 hover:bg-dark-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
