import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import ReactPlayer from 'react-player'
import { FiArrowLeft, FiHeart, FiStar, FiLoader, FiInfo } from 'react-icons/fi'
import { toast } from 'react-toastify'
import useAuthStore from '../store/authStore'

export default function ChannelPlayer() {
  const { id } = useParams()
  const { user, token } = useAuthStore()
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchChannel()
    if (user && token) {
      registerView()
    }
  }, [id])

  const fetchChannel = async () => {
    try {
      const { data } = await axios.get(`/api/channels/${id}`)
      setChannel(data.channel)
    } catch (error) {
      toast.error('Error cargando el canal')
    } finally {
      setLoading(false)
    }
  }

  const registerView = async () => {
    try {
      await axios.post(`/api/channels/${id}/view`)
    } catch (error) {
      console.error('Error registrando vista:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      toast.info('Debes iniciar sesión para agregar favoritos')
      return
    }

    try {
      const { data } = await axios.post(`/api/channels/${id}/favorite`)
      setIsFavorite(data.isFavorite)
      toast.success(data.message)
    } catch (error) {
      toast.error('Error al actualizar favoritos')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <FiLoader className="text-6xl text-primary-500 animate-spin" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Canal no encontrado</h2>
          <Link to="/channels" className="btn btn-primary">
            Volver a canales
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Video Player */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="aspect-video">
            <ReactPlayer
              url={channel.streamUrl}
              playing={playing}
              controls
              width="100%"
              height="100%"
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload'
                  }
                }
              }}
              onError={(error) => {
                console.error('Error de reproducción:', error)
                toast.error('Error al reproducir el canal. Verifica la conexión.')
              }}
            />
          </div>
        </div>
      </div>

      {/* Channel Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/channels"
          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 mb-6 transition-colors"
        >
          <FiArrowLeft />
          <span>Volver a canales</span>
        </Link>

        {/* Channel Details */}
        <div className="card">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{channel.name}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="category-badge">{channel.category}</span>
                    {channel.quality && (
                      <span className="px-3 py-1 bg-green-600/20 text-green-400 text-xs font-medium rounded-full">
                        {channel.quality}
                      </span>
                    )}
                    {channel.is24x7 && (
                      <span className="px-3 py-1 bg-red-600/20 text-red-400 text-xs font-medium rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        24/7
                      </span>
                    )}
                    {channel.country && (
                      <span className="text-xs text-dark-400 font-medium">
                        📍 {channel.country}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={toggleFavorite}
                  className={`p-3 rounded-lg transition-all ${
                    isFavorite
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-dark-800 hover:bg-dark-700 text-dark-300'
                  }`}
                >
                  <FiHeart className={isFavorite ? 'fill-current' : ''} size={24} />
                </button>
              </div>

              {channel.description && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiInfo className="text-primary-500" />
                    <h3 className="font-semibold">Descripción</h3>
                  </div>
                  <p className="text-dark-400">{channel.description}</p>
                </div>
              )}

              {channel.tags && channel.tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {channel.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-dark-800 text-dark-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 text-sm text-dark-400">
                {channel.viewCount > 0 && (
                  <span>👁️ {channel.viewCount.toLocaleString()} vistas</span>
                )}
                {channel.rating.count > 0 && (
                  <span className="flex items-center gap-1">
                    <FiStar className="text-yellow-500" />
                    {channel.rating.average.toFixed(1)} ({channel.rating.count} votos)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Channels - Placeholder */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Canales Relacionados</h2>
          <p className="text-dark-400">Próximamente...</p>
        </div>
      </div>
    </div>
  )
}
