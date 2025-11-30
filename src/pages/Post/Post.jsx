import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export function Post() {
  const { isAuthenticated, user } = useAuth()
  
  // Estados
  const [posts, setPosts] = useState([])
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all' o 'my-posts'
  const [userProfile, setUserProfile] = useState(null) // Perfil completo con photo_url

  // Cargar perfil del usuario autenticado
  useEffect(() => {
    const loadUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get('/profile/me')
          setUserProfile(response.data.profile)
        } catch (err) {
          console.error('Error al cargar perfil:', err)
        }
      }
    }
    loadUserProfile()
  }, [isAuthenticated])

  // Cargar publicaciones al montar y cambiar tab
  useEffect(() => {
    loadPosts()
  }, [activeTab])

  // Función para cargar publicaciones
  const loadPosts = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (activeTab === 'all') {
        // GET /posts - Todas las publicaciones (público)
        const response = await api.get('/posts')
        const postsData = Array.isArray(response.data) ? response.data : []
        
        // Enriquecer cada post con el perfil del usuario (para obtener photo_url)
        const enrichedPosts = await Promise.all(
          postsData.map(async (post) => {
            try {
              // Si es mi propio post, usar mi perfil cargado
              if (user && post.user_id === user.id && userProfile) {
                return {
                  ...post,
                  user: {
                    ...post.user,
                    photo_url: userProfile.photo_url || null
                  }
                }
              }
              
              // GET /profile/:userId - Obtener perfil con photo_url de otros usuarios
              const profileResponse = await api.get(`/profile/${post.user_id}`)
              return {
                ...post,
                user: {
                  ...post.user,
                  photo_url: profileResponse.data.profile?.photo_url || null
                }
              }
            } catch (error) {
              // Si falla, devolver el post sin modificar
              console.error(`Error al cargar perfil del usuario ${post.user_id}:`, error)
              return post
            }
          })
        )
        
        setPosts(enrichedPosts)
      } else {
        // GET /posts/my-posts - Mis publicaciones (requiere auth)
        const response = await api.get('/posts/my-posts')
        setPosts(response.data.post || [])
      }
    } catch (err) {
      setError('Error al cargar publicaciones')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Función para manejar selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    
    if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
      setError('Solo se permiten imágenes (JPG, PNG, GIF, WEBP) o videos (MP4, WEBM, OGG, MOV)')
      return
    }

    // Validar tamaño (máximo 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('El archivo no debe superar 50MB')
      return
    }

    setSelectedFile(file)
    setError('')

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setFilePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Función para remover archivo
  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
  }

  // Función para crear publicación
  const handleCreatePost = async (e) => {
    e.preventDefault()
    
    if (!text.trim()) {
      setError('El texto es requerido')
      return
    }

    try {
      setLoading(true)
      setError('')

      // Nota: El backend solo acepta URL string, no archivos
      // Si hay archivo seleccionado, usamos el preview local como URL
      const postUrl = selectedFile ? filePreview : (url.trim() || undefined)
      
      // POST /posts - Crear publicación
      await api.post('/posts', {
        text: text.trim(),
        url: postUrl
      })
      
      // Limpiar formulario
      setText('')
      setUrl('')
      setSelectedFile(null)
      setFilePreview(null)
      
      // Recargar publicaciones
      await loadPosts()
    } catch (err) {
      setError('Error al crear publicación')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Función para eliminar publicación
  const handleDeletePost = async (postId) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return

    try {
      setLoading(true)
      setError('')
      
      // DELETE /posts/:id
      await api.delete(`/posts/${postId}`)
      
      // Recargar publicaciones
      await loadPosts()
    } catch (err) {
      setError('Error al eliminar publicación')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  // Verificar si el post es del usuario actual
  const isOwnPost = (post) => {
    return user && post.user_id === user.id
  }

  // Función para extraer username del email
  const getUsernameFromEmail = (email) => {
    if (!email) return 'Usuario'
    return email.split('@')[0]
  }

  // Función para detectar tipo de medio desde URL
  const getMediaType = (url) => {
    if (!url) return null
    
    // Detectar base64 (imágenes y videos subidos desde el formulario)
    if (url.startsWith('data:')) {
      if (url.startsWith('data:image/')) return 'image'
      if (url.startsWith('data:video/')) return 'video'
    }
    
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov']
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    
    const lowerUrl = url.toLowerCase()
    
    if (videoExtensions.some(ext => lowerUrl.includes(ext))) return 'video'
    if (imageExtensions.some(ext => lowerUrl.includes(ext))) return 'image'
    
    // Detectar YouTube
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube'
    
    return 'link'
  }

  // Función para renderizar medio
  const renderMedia = (url) => {
    const mediaType = getMediaType(url)
    
    if (mediaType === 'image') {
      return (
        <img 
          src={url} 
          alt="Contenido de publicación" 
          className="w-full rounded-lg mt-3 max-h-96 object-cover"
          onError={(e) => e.target.style.display = 'none'}
        />
      )
    }
    
    if (mediaType === 'video') {
      return (
        <video 
          src={url} 
          controls 
          className="w-full rounded-lg mt-3 max-h-96"
          onError={(e) => e.target.style.display = 'none'}
        />
      )
    }
    
    if (mediaType === 'youtube') {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0]
      
      if (videoId) {
        return (
          <iframe
            className="w-full rounded-lg mt-3"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )
      }
    }
    
    if (mediaType === 'link') {
      return (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block mt-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <div className="flex items-center text-blue-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {url}
          </div>
        </a>
      )
    }
    
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-[80%] mx-auto py-8 px-4">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Publicaciones</h1>
          <p className="text-gray-600 mt-1">Comparte tu actividad deportiva</p>
        </div>

        {/* Formulario de crear publicación */}
        {isAuthenticated && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <form onSubmit={handleCreatePost}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                  {userProfile?.photo_url ? (
                    <img 
                      src={userProfile.photo_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="¿Qué está pasando?"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                    maxLength="500"
                  />
                  
                  {/* Vista previa del archivo */}
                  {filePreview && (
                    <div className="relative mt-3 border border-gray-300 rounded-lg overflow-hidden">
                      {selectedFile?.type.startsWith('image/') ? (
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          className="w-full max-h-96 object-contain"
                        />
                      ) : (
                        <video 
                          src={filePreview} 
                          controls 
                          className="w-full max-h-96"
                        />
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      {/* Botón para cargar archivo */}
                      <input
                        type="file"
                        id="file-upload"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-700 transition"
                        title="Cargar imagen o video"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </label>
                      
                      <span className="text-sm text-gray-500">
                        {text.length}/500
                      </span>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading || !text.trim()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                      {loading ? 'Publicando...' : 'Publicar'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-t-lg shadow-sm border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Todas las publicaciones
            </button>
            
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab('my-posts')}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === 'my-posts'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Mis publicaciones
              </button>
            )}
          </div>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Lista de publicaciones */}
        <div className="bg-white rounded-b-lg shadow-sm">
          {loading && posts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Cargando publicaciones...
            </div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {activeTab === 'my-posts' 
                ? 'No tienes publicaciones aún' 
                : 'No hay publicaciones disponibles'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                      {(post.user?.photo_url || (activeTab === 'my-posts' && userProfile?.photo_url)) ? (
                        <img 
                          src={post.user?.photo_url || userProfile?.photo_url} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {getUsernameFromEmail(post.user?.email || (activeTab === 'my-posts' ? user?.email : null))?.[0]?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 font-semibold">
                            @{getUsernameFromEmail(post.user?.email || (activeTab === 'my-posts' ? user?.email : null))}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {formatDate(post.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Texto de la publicación */}
                      <p className="text-gray-800 mt-3 whitespace-pre-wrap break-words">
                        {post.text}
                      </p>
                      
                      {/* Media (imagen/video/link) */}
                      {post.url && renderMedia(post.url)}
                    </div>
                    
                    {/* Botón eliminar al lado derecho */}
                    {isOwnPost(post) && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={loading}
                        className="flex-shrink-0 text-red-600 hover:text-red-800 disabled:text-gray-400 p-2 transition"
                        title="Eliminar publicación"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info de no autenticado */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mt-6">
            <p className="font-semibold">Inicia sesión para publicar</p>
            <p className="text-sm mt-1">Regístrate para compartir tus momentos deportivos</p>
          </div>
        )}
      </div>
    </div>
  )
}