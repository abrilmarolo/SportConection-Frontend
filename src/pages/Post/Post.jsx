import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export function Post() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    content: '',
    image: null,
    video: null,
    imageFile: null,
    videoFile: null
  });
  const [isPosting, setIsPosting] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingPosts, setDeletingPosts] = useState(new Set());
  const [activeTab, setActiveTab] = useState('para-ti'); // 'para-ti' o 'mis-posts'

  // Cargar publicaciones desde el backend
  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/posts');
      setPosts(response.data.posts || response.data || []);
    } catch (error) {
      setError('Error al cargar las publicaciones');
      console.error('Error loading posts:', error);
      // Mostrar datos de ejemplo en caso de error para desarrollo
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    setIsPosting(true);
    
    try {
      const postData = {
        text: newPost.content, // El backend espera 'text' no 'content'
      };

      await api.post('/posts', postData);

      // Recargar publicaciones
      await loadPosts();
      
      // Limpiar formulario
      setNewPost({ content: '', image: null, video: null, imageFile: null, videoFile: null });
      
    } catch (error) {
      setError(`Error al crear la publicación: ${error.message}`);
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const toggleComments = async (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    // Si estamos abriendo los comentarios, cargarlos
    if (!showComments[postId]) {
      await loadComments(postId);
    }
  };

  const loadComments = async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      const data = response.data;
      
      // Actualizar el post con los comentarios
      setPosts(posts.map(post => 
        (post._id === postId || post.id === postId)
          ? { ...post, comments: data.comments || data || [] }
          : post
      ));
      
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    const commentText = commentTexts[postId];
    
    if (!commentText?.trim()) return;

    try {
      await api.post(`/posts/${postId}/comments`, { text: commentText });

      // Limpiar campo de comentario
      setCommentTexts(prev => ({
        ...prev,
        [postId]: ''
      }));

      // Recargar comentarios
      await loadComments(postId);
      
    } catch (error) {
      console.error('Error adding comment:', error);
      // Agregar comentario optimísticamente si falla la API
      const newComment = {
        _id: Date.now(),
        text: commentText, // Cambiar 'content' a 'text'
        author: {
          _id: user?.id,
          name: user?.name || 'Usuario',
          username: user?.username || 'usuario'
        },
        createdAt: new Date()
      };
      
      setPosts(posts.map(post => 
        (post._id === postId || post.id === postId)
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      ));
      
      setCommentTexts(prev => ({
        ...prev,
        [postId]: ''
      }));
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentTexts(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewPost({ 
        ...newPost, 
        [type]: url,
        [`${type}File`]: file
      });
    }
  };

  // Función para verificar si es publicación propia
  const isOwnPost = (post) => {
    console.log('Verificando post propio:', {
      postUserId: post.userId,
      postAuthorId: post.author?._id,
      postAuthorUserId: post.author?.id,
      postAuthorUserId2: post.author?.userId,
      currentUserId: user?.id,
      currentUser_id: user?._id,
      user: user
    });
    
    // Verificar múltiples posibles campos para el ID del usuario
    const isOwn = post.userId === user?.id || 
                  post.userId === user?._id ||
                  post.author?._id === user?.id || 
                  post.author?._id === user?._id ||
                  post.author?.id === user?.id ||
                  post.author?.id === user?._id ||
                  post.author?.userId === user?.id ||
                  post.author?.userId === user?._id;
    
    console.log('Es post propio:', isOwn);
    return isOwn;
  };

  // Función para verificar si es comentario propio
  const isOwnComment = (comment) => {
    return comment.userId === user?.id || comment.author?._id === user?.id || comment.author?.id === user?.id;
  };

  // Función para formatear timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'ahora';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const handleDeletePost = async (postId) => {
    const post = posts.find(p => (p._id || p.id) === postId);
    
    if (!isOwnPost(post)) {
      alert('No puedes eliminar este post porque no es tuyo');
      return;
    }
    
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      return;
    }

    setDeletingPosts(prev => new Set(prev).add(postId));
    
    try {
      console.log('Intentando eliminar post:', postId);
      await api.delete(`/posts/${postId}`);
      console.log('Post eliminado exitosamente');

      // Actualizar la lista de posts removiendo el eliminado
      setPosts(posts.filter(post => (post._id || post.id) !== postId));
      console.log('Post eliminado exitosamente');
      
    } catch (error) {
      setError(`Error al eliminar la publicación: ${error.message}`);
      console.error('Error deleting post:', error);
    } finally {
      setDeletingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  // Función para filtrar posts según la pestaña activa
  const getFilteredPosts = () => {
    if (activeTab === 'mis-posts') {
      return posts.filter(post => isOwnPost(post));
    }
    return posts; // Para Ti - todos los posts
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-700 dark:bg-red-900 rounded-lg">
          <h2 className="text-2xl text-white font-normal">Acceso Denegado</h2>
          <p className="mt-2 text-white">Debes iniciar sesión para ver las publicaciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Header con pestañas */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Publicaciones</h1>
            
            {/* Pestañas */}
            <div className="flex border-b border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setActiveTab('para-ti')}
                className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                  activeTab === 'para-ti'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Para Ti
              </button>
              <button
                onClick={() => setActiveTab('mis-posts')}
                className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                  activeTab === 'mis-posts'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Mis Posts ({posts.filter(post => isOwnPost(post)).length})
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mx-4 mt-4">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Crear Nueva Publicación - Solo en "Para Ti" */}
        {activeTab === 'para-ti' && (
          <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4">
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div className="flex space-x-3">
                <img 
                  src="/api/placeholder/40/40" 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="¿Qué está pasando?"
                    className="w-full text-xl placeholder-gray-500 dark:placeholder-gray-400 bg-transparent text-gray-900 dark:text-white resize-none border-none focus:outline-none"
                    rows="3"
                  />
                  
                  {/* Vista previa de imagen */}
                  {newPost.image && (
                    <div className="mt-3 relative">
                      <img src={newPost.image} alt="Preview" className="rounded-2xl max-h-96 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewPost({ ...newPost, image: null })}
                        className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white rounded-full p-1 hover:bg-opacity-90"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Vista previa de video */}
                  {newPost.video && (
                    <div className="mt-3 relative">
                      <video src={newPost.video} controls className="rounded-2xl max-h-96 w-full" />
                      <button
                        type="button"
                        onClick={() => setNewPost({ ...newPost, video: null })}
                        className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white rounded-full p-1 hover:bg-opacity-90"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
                <div className="flex space-x-4">
                  <label className="cursor-pointer text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 p-2 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="hidden"
                    />
                  </label>
                  
                  <label className="cursor-pointer text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 p-2 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!newPost.content.trim() || isPosting}
                  className="bg-blue-500 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPosting ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando publicaciones...</span>
          </div>
        )}

        {/* Feed de Publicaciones Filtradas */}
        <div className="space-y-0">
          {getFilteredPosts().length === 0 && !loading ? (
            <div className="bg-white dark:bg-gray-800 p-8 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                {activeTab === 'mis-posts' ? (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tienes publicaciones aún</h3>
                    <p className="text-gray-600 dark:text-gray-400">¡Crea tu primera publicación para compartir con la comunidad!</p>
                  </>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No hay publicaciones disponibles</h3>
                    <p className="text-gray-600 dark:text-gray-400">Sé el primero en compartir algo con la comunidad.</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            getFilteredPosts().map((post) => {
              const postId = post._id || post.id;
              const postUser = post.author || post.user;
              const postComments = post.comments || [];

              return (
                <div key={postId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors">
                  <div className="p-4">
                    <div className="flex space-x-3">
                      <img 
                        src={postUser?.avatar || postUser?.profileImage || '/api/placeholder/40/40'} 
                        alt={postUser?.name || postUser?.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {postUser?.name || postUser?.username || 'Usuario'}
                            </h3>
                            <span className="text-gray-500 dark:text-gray-400">
                              @{postUser?.username || 'usuario'}
                            </span>
                            {isOwnPost(post) && (
                              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium">
                                Tú
                              </span>
                            )}
                            <span className="text-gray-500 dark:text-gray-400">·</span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {formatTimestamp(post.createdAt || post.timestamp)}
                            </span>
                          </div>
                          
                          {/* Botón de eliminar con icono de tacho - Solo para posts propios */}
                          {isOwnPost(post) && (
                            <button
                              onClick={() => handleDeletePost(postId)}
                              disabled={deletingPosts.has(postId)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-2"
                              title="Eliminar publicación"
                            >
                              {deletingPosts.has(postId) ? (
                                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                        
                        <p className="mt-2 text-gray-900 dark:text-white">{post.text || post.content}</p>
                        
                        {/* Vista previa de imagen */}
                        {post.image && (
                          <img 
                            src={post.image} 
                            alt="Post content"
                            className="mt-3 rounded-2xl max-h-96 w-full object-cover"
                          />
                        )}

                        {/* Vista previa de video */}
                        {post.video && (
                          <video 
                            src={post.video} 
                            controls
                            className="mt-3 rounded-2xl max-h-96 w-full"
                          />
                        )}

                        {/* Botones de interacción - Solo comentarios */}
                        <div className="flex mt-4 text-gray-500 dark:text-gray-400">
                          <button 
                            onClick={() => toggleComments(postId)}
                            className="flex items-center space-x-2 hover:text-blue-500 group"
                          >
                            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <span>{postComments.length} comentarios</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección de Comentarios */}
                  {showComments[postId] && (
                    <div className="border-t dark:border-gray-700">
                      {/* Formulario para nuevo comentario */}
                      <div className="p-4 border-b dark:border-gray-700">
                        <form onSubmit={(e) => handleCommentSubmit(postId, e)} className="flex space-x-3">
                          <img 
                            src={user?.avatar || user?.profileImage || '/api/placeholder/32/32'} 
                            alt="Tu avatar"
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <textarea
                              value={commentTexts[postId] || ''}
                              onChange={(e) => handleCommentChange(postId, e.target.value)}
                              placeholder="Escribe un comentario..."
                              className="w-full text-sm placeholder-gray-500 dark:placeholder-gray-400 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white resize-none border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows="2"
                            />
                            <div className="mt-2 flex justify-end">
                              <button
                                type="submit"
                                disabled={!commentTexts[postId]?.trim()}
                                className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Comentar
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>

                      {/* Lista de comentarios */}
                      <div className="max-h-96 overflow-y-auto">
                        {postComments.map((comment) => {
                          const commentUser = comment.author || comment.user;
                          return (
                            <div key={comment._id || comment.id} className="p-4 border-b dark:border-gray-700 last:border-b-0">
                              <div className="flex space-x-3">
                                <img 
                                  src={commentUser?.avatar || commentUser?.profileImage || '/api/placeholder/32/32'} 
                                  alt={commentUser?.name || commentUser?.username}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                                      {commentUser?.name || commentUser?.username || 'Usuario'}
                                    </h4>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                                      @{commentUser?.username || 'usuario'}
                                    </span>
                                    {isOwnComment(comment) && (
                                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                        Tú
                                      </span>
                                    )}
                                    {isOwnPost(post) && (comment.author?._id === post.author?._id || comment.userId === post.userId) && (
                                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                        Autor
                                      </span>
                                    )}
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                                      {formatTimestamp(comment.createdAt || comment.timestamp)}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{comment.text || comment.content}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Mensaje cuando no hay comentarios */}
                        {postComments.length === 0 && (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            <p className="text-sm">No hay comentarios aún.</p>
                            <p className="text-xs mt-1">
                              {isOwnPost(post) 
                                ? "Sé el primero en comentar tu publicación" 
                                : "Sé el primero en comentar"
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}