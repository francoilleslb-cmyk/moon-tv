import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FiSearch, FiFilter, FiTv, FiLoader, FiPlay, FiStar } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function Series() {
  const [series, setSeries] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchSeries()
  }, [selectedGenre, page])

  const fetchSeries = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 24,
        ...(selectedGenre && { genre: selectedGenre }),
        sort: '-createdAt'
      }
      
      const { data } = await axios.get('/api/series', { params })
      setSeries(data.series || [])
      setTotalPages(data.pages || 1)
      
      // Extraer géneros únicos
      if (data.series) {
        const allGenres = new Set()
        data.series.forEach(serie => {
          if (serie.genres) {
            serie.genres.forEach(g => allGenres.add(g))
          }
        })
        setGenres([...allGenres])
      }
    } catch (error) {
      toast.error('Error cargando series')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      const { data } = await axios.get('/api/series/search', {
        params: { q: searchTerm, limit: 24 }
      })
      setSeries(data.series || [])
      setSelectedGenre('')
    } catch (error) {
      toast.error('Error en la búsqueda')
    } finally {
      setLoading(false)
    }
  }

  const getTotalEpisodes = (serie) => {
    if (!serie.seasons) return 0
    return serie.seasons.reduce((total, season) => total + (season.episodes?.length || 0), 0)
  }

  return (
    <div className="min-h-screen bg-dark-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <FiTv className="text-primary-500" />
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              Series
            </span>
          </h1>
          <p className="text-dark-400 text-lg">
            {series.length} series disponibles
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar series..."
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

        {/* Genres Filter */}
        {genres.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FiFilter className="text-primary-500 text-xl" />
              <h2 className="text-xl font-semibold">Géneros</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre('')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedGenre === ''
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                }`}
              >
                Todas
              </button>
              
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedGenre === genre
                      ? 'bg-primary-600 text-white shadow-glow'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Series Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FiLoader className="text-6xl text-primary-500 animate-spin" />
          </div>
        ) : series.length === 0 ? (
          <div className="text-center py-20">
            <FiTv className="text-6xl text-dark-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-dark-400 mb-2">
              No se encontraron series
            </h3>
            <p className="text-dark-500">
              Intenta con otra búsqueda o importa tu archivo M3U
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {series.map((serie) => (
              <div
                key={serie._id}
                className="group cursor-pointer"
              >
                <div className="aspect-[2/3] bg-dark-900 rounded-xl overflow-hidden relative mb-3 border border-dark-800 hover:border-primary-600 transition-all duration-300 hover:shadow-glow">
                  {serie.poster ? (
                    <img
                      src={serie.poster}
                      alt={serie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%231f2933" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" fill="%239aa5b1" text-anchor="middle" dy=".3em" font-size="24"%3E📺%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiTv className="text-6xl text-dark-600" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FiPlay className="text-white text-4xl" />
                  </div>

                  {/* Status Badge */}
                  {serie.status && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-primary-600 text-xs font-bold rounded">
                      {serie.status}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-bold text-sm mb-1 group-hover:text-primary-400 transition-colors line-clamp-2">
                    {serie.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-dark-400 mb-1">
                    <span>
                      {serie.seasons?.length || 0} temp. • {getTotalEpisodes(serie)} ep.
                    </span>
                    {serie.rating?.imdb && (
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-500" />
                        <span>{serie.rating.imdb}</span>
                      </div>
                    )}
                  </div>

                  {serie.genres && serie.genres.length > 0 && (
                    <div className="mt-2">
                      <span className="category-badge text-xs">
                        {serie.genres[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

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
      </div>
    </div>
  )
}
