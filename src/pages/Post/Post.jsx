import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

// Clase PostUser - Equivalente a PostUser.java
class PostUser {
  constructor(data = {}) {
    this.id = data.id || 0
    this.email = data.email || ''
    this.role = data.role || ''
    this.name = data.name || ''
    this.lastName = data.last_name || data.lastName || ''
    this.photoUrl = data.photo_url || data.photoUrl || null
  }

  // Método auxiliar para obtener el nombre completo (equivalente a getFullName() en Java)
  getFullName() {
    if (this.name && this.name.trim() && this.lastName && this.lastName.trim()) {
      return `${this.name} ${this.lastName}`
    } else if (this.name && this.name.trim()) {
      return this.name
    } else if (this.lastName && this.lastName.trim()) {
      return this.lastName
    } else if (this.email && this.email.trim()) {
      // Extraer un nombre del email (parte antes del @)
      let username = this.email.split('@')[0]
      // Capitalizar primera letra y reemplazar puntos/guiones con espacios
      username = username.replace(/\./g, ' ').replace(/_/g, ' ').replace(/-/g, ' ')
      // Capitalizar cada palabra
      const words = username.split(' ')
      const result = words
        .map(word => {
          if (word.length > 0) {
            return word.charAt(0).toUpperCase() + (word.length > 1 ? word.substring(1).toLowerCase() : '')
          }
          return ''
        })
        .join(' ')
        .trim()
      return result
    } else {
      return 'Usuario desconocido'
    }
  }
}

// Clase PostModel - Equivalente a Post.java
class PostModel {
  constructor(data = {}) {
    this.id = data.id || 0
    this.userId = data.user_id || data.userId || 0
    this.text = data.text || ''
    this.url = data.url || null
    this.createdAt = data.created_at || data.createdAt || ''
    this.user = new PostUser(data.user || {})
  }
}

export function Post() {
  const { isAuthenticated, user } = useAuth()
  
  // Estados
  const [posts, setPosts] = useState([])
  const [text, setText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [error, setError] = useState('')
  const [userProfile, setUserProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('all') // 'all' o 'my-posts'

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

  // Cargar publicaciones al montar
  useEffect(() => {
    if (activeTab === 'all' || (activeTab === 'my-posts' && isAuthenticated)) {
      loadPosts()
    }
  }, [activeTab, userProfile])

  // Función para cargar publicaciones
  const loadPosts = async () => {
    try {
      setLoadingPosts(true)
      setError('')
      
      if (activeTab === 'all') {
        // GET /posts - Todas las publicaciones
        const response = await api.get('/posts')
        const postsData = Array.isArray(response.data) ? response.data : []
        
        // Enriquecer cada post con datos del perfil del usuario
        const enrichedPosts = await Promise.all(
          postsData.map(async (postData) => {
            try {
              const post = new PostModel(postData)
              
              // Si es mi propio post, usar mi perfil cargado
              // Comparar por ID o por email (por si el backend tiene IDs inconsistentes)
              const isMyPost = user && userProfile && (
                String(post.userId) === String(user.id) || 
                String(postData.user_id) === String(user.id) ||
                (postData.user?.email && postData.user.email === user.email)
              )
              
              if (isMyPost) {
                // FORZAR el userId correcto
                post.userId = user.id
                post.user.name = userProfile.name || ''
                post.user.lastName = userProfile.last_name || ''
                post.user.photoUrl = userProfile.photo_url || null
                post.user.email = user.email || ''
                return post
              }
              
              // Para otros usuarios, obtener su perfil desde /profile/:userId
              try {
                const profileResponse = await api.get(`/profile/${post.userId}`)
                const profileData = profileResponse.data.profile || {}
                
                // El endpoint /profile/:userId solo devuelve name, photo_url, sport, location, description
                // Necesitamos mantener email y last_name del objeto original del post
                post.user.name = profileData.name || ''
                post.user.photoUrl = profileData.photo_url || profileData.photoUrl || null
                // Mantener last_name y email del objeto original ya que /profile/:userId no los devuelve
                
                return post
              } catch (profileError) {
                console.error(`Error loading profile for user ${post.userId}:`, profileError)
                return post
              }
            } catch (error) {
              console.error('Error processing post:', error)
              return new PostModel(postData)
            }
          })
        )
        
        setPosts(enrichedPosts)
      } else {
        // GET /posts/my-posts - Mis publicaciones
        const response = await api.get('/posts/my-posts')
        const myPostsData = response.data.post || []
        
        // Convertir a instancias de PostModel y enriquecer con mi perfil
        const myPosts = myPostsData.map(postData => {
          const post = new PostModel(postData)
          
          // FORZAR el userId a ser el del usuario actual ya que /posts/my-posts solo devuelve mis posts
          if (user?.id) {
            post.userId = user.id
          }
          
          if (userProfile) {
            post.user.name = userProfile.name || ''
            post.user.lastName = userProfile.last_name || ''
            post.user.photoUrl = userProfile.photo_url || null
          }
          return post
        })
        
        setPosts(myPosts)
      }
    } catch (err) {
      setError('Error al cargar publicaciones')
      console.error(err)
    } finally {
      setLoadingPosts(false)
    }
  }

  // Función para manejar selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    
    if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
      setError('Solo se permiten imágenes o videos')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('El archivo no debe superar 50MB')
      return
    }

    setSelectedFile(file)
    setError('')

    const reader = new FileReader()
    reader.onloadend = () => {
      setFilePreview(reader.result)
    }
    reader.readAsDataURL(file)
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

      const postUrl = selectedFile ? filePreview : undefined
      
      await api.post('/posts', {
        text: text.trim(),
        url: postUrl
      })
      
      setText('')
      setSelectedFile(null)
      setFilePreview(null)
      
      toast.success('¡Publicación creada exitosamente!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      
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
      setLoadingPosts(true)
      setError('')
      await api.delete(`/posts/${postId}`)
      
      toast.success('¡Publicación eliminada exitosamente!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      
      await loadPosts()
    } catch (err) {
      setError('Error al eliminar publicación')
      console.error(err)
    } finally {
      setLoadingPosts(false)
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

    if (diffMins < 1) return 'ahora'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  // Verificar si el post es del usuario actual
  const isOwnPost = (post) => {
    if (!user) return false
    const postUserId = post.userId || post.user?.id
    const currentUserId = user.id || user.userId
    return String(postUserId) === String(currentUserId)
  }

  // Función para detectar tipo de medio
  const getMediaType = (url) => {
    if (!url) return null
    
    if (url.startsWith('data:image/')) return 'image'
    if (url.startsWith('data:video/')) return 'video'
    
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov']
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    
    const lowerUrl = url.toLowerCase()
    
    if (videoExtensions.some(ext => lowerUrl.includes(ext))) return 'video'
    if (imageExtensions.some(ext => lowerUrl.includes(ext))) return 'image'
    
    return null
  }

  // Función para renderizar medio
  const renderMedia = (url) => {
    const mediaType = getMediaType(url)
    
    if (mediaType === 'image') {
      return (
        <img 
          src={url} 
          alt="Contenido de publicación" 
          className="w-full rounded-lg mt-2 sm:mt-3 max-h-60 sm:max-h-96 object-cover"
          onError={(e) => e.target.style.display = 'none'}
        />
      )
    }
    
    if (mediaType === 'video') {
      return (
        <video 
          src={url} 
          controls 
          className="w-full rounded-lg mt-2 sm:mt-3 max-h-60 sm:max-h-96"
          onError={(e) => e.target.style.display = 'none'}
        />
      )
    }
    
    return null
  }

  return (
    <>
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-red-700 dark:bg-red-900 rounded-lg">
            <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
            <p className="mt-2 text-white">Debes iniciar sesión para ver las publicaciones</p>
          </div>
        </div>
      ) : (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full sm:w-[95%] lg:w-[85%] xl:w-[80%] mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Publicaciones</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Comparte tu actividad deportiva</p>
        </div>

        {/* Formulario de crear publicación */}
        {isAuthenticated && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
            <form onSubmit={handleCreatePost}>
              <div className="flex items-start space-x-2 sm:space-x-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                  {userProfile?.photo_url ? (
                    <img 
                      src={userProfile.photo_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-base sm:text-lg">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="¿Qué está pasando?"
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none resize-none"
                    rows="3"
                    maxLength="500"
                  />
                  
                  {/* Vista previa del archivo */}
                  {filePreview && (
                    <div className="relative mt-2 sm:mt-3 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      {selectedFile?.type.startsWith('image/') ? (
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          className="w-full max-h-60 sm:max-h-96 object-contain"
                        />
                      ) : (
                        <video 
                          src={filePreview} 
                          controls 
                          className="w-full max-h-60 sm:max-h-96"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null)
                          setFilePreview(null)
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-3 sm:mt-4">
                    <div className="flex items-center space-x-2">
                      {/* Botón para cargar archivo */}
                      <input
                        type="file"
                        id="media-upload"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="media-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-700 transition"
                        title="Cargar imagen o video"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </label>
                      
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {text.length}/500
                      </span>
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={loading || !text.trim()}
                      className="bg-blue-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      {loading ? 'Publicando...' : 'Publicar'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-sm border-b dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base font-semibold transition ${
                activeTab === 'all'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Todas las publicaciones
            </button>
            
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab('my-posts')}
                className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base font-semibold transition ${
                  activeTab === 'my-posts'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Mis publicaciones
              </button>
            )}
          </div>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Lista de publicaciones */}
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-sm">
          {loadingPosts && posts.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Cargando publicaciones...
            </div>
          ) : posts.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
              {activeTab === 'my-posts' 
                ? 'No tienes publicaciones aún' 
                : 'No hay publicaciones disponibles'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <div key={post.id} className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                      {post.user.photoUrl ? (
                        <img 
                          src={post.user.photoUrl} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-base sm:text-lg">
                          {post.user.getFullName()[0]?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    
                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                            <p className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold truncate">
                              {post.user.getFullName()}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                              {post.user.email}
                            </p>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Texto de la publicación */}
                      <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 mt-2 sm:mt-3 whitespace-pre-wrap break-words">
                        {post.text}
                      </p>
                      
                      {/* Media (imagen/video) */}
                      {post.url && renderMedia(post.url)}
                    </div>
                    
                    {/* Botón eliminar al lado derecho */}
                    {isOwnPost(post) && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={loadingPosts}
                        className="flex-shrink-0 text-red-600 hover:text-red-800 disabled:text-gray-400 p-1 sm:p-2 transition"
                        title="Eliminar publicación"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>
    </div>
      )}
    </>
  )
}