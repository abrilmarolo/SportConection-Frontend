import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect } from 'react';

export function PublicHome() {
  const { user, isAuthenticated} = useAuth() || {};
  const [currentSlide, setCurrentSlide] = useState(0);
  const isDarkMode = document.documentElement.classList.contains('dark');

  // Slides para el carousel
  const slides = [
    {
      title: "Conecta con el Deporte",
      description: "Une atletas, representantes y equipos en una sola plataforma",
      image: "🏆",
      color: "bg-green-500"
    },
    {
      title: "Oportunidades Profesionales",
      description: "Da el salto a la profesionalidad con nuestras herramientas",
      image: "⚡",
      color: "bg-blue-500"
    },
    {
      title: "Comunidad Global",
      description: "Conecta con talento deportivo de todo el mundo",
      image: "🌎",
      color: "bg-purple-500"
    }
  ];

  // Navegación del carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 my-5">
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚽</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-light text-gray-800 dark:text-white mb-4">
              SportConnection
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Plataforma profesional para la conexión y desarrollo deportivo
            </p>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-8">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`text-center transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 absolute'
                  }`}
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">{slide.image}</span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-3">{slide.title}</h3>
                  <p className="text-gray-600">{slide.description}</p>
                </div>
              ))}
              
              <div className="flex justify-center space-x-2 mt-8">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-light text-center mb-12 text-gray-800 dark:text-white">
            Nuestro Enfoque
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg">🔍</span>
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">Talent Discovery</h3>
              <p className="text-gray-600 text-sm">
                Identificación y conexión con talento deportivo emergente y establecido
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg">💼</span>
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">Career Management</h3>
              <p className="text-gray-600 text-sm">
                Herramientas profesionales para la gestión de carreras deportivas
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg">🌐</span>
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">Global Network</h3>
              <p className="text-gray-600 text-sm">
                Conexiones internacionales en el ecosistema deportivo profesional
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-light text-center mb-12 text-gray-800">Para la Comunidad Deportiva</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center mb-4">
                <span className="text-2xl">🏃‍♂️</span>
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-800 text-center">Atletas</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Perfiles profesionales</li>
                <li>• Exposición a oportunidades</li>
                <li>• Gestión de carrera</li>
                <li>• Conexión con representantes</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-800 text-center">Representantes</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Base de datos de talento</li>
                <li>• Herramientas de gestión</li>
                <li>• Networking profesional</li>
                <li>• Oportunidades exclusivas</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-800 text-center">Equipos</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Scouting avanzado</li>
                <li>• Gestión de pruebas</li>
                <li>• Comunicación directa</li>
                <li>• Análisis de talento</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div>
              <div className="text-2xl font-light text-gray-800 mb-2">500+</div>
              <div className="text-sm text-gray-600">Atletas</div>
            </div>
            <div>
              <div className="text-2xl font-light text-gray-800 mb-2">120+</div>
              <div className="text-sm text-gray-600">Representantes</div>
            </div>
            <div>
              <div className="text-2xl font-light text-gray-800 mb-2">80+</div>
              <div className="text-sm text-gray-600">Equipos</div>
            </div>
            <div>
              <div className="text-2xl font-light text-gray-800 mb-2">25+</div>
              <div className="text-sm text-gray-600">Países</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-light mb-4 text-white">Comience su Journey Deportivo</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Únase a la plataforma profesional para el desarrollo deportivo
          </p>
          
          {!isAuthenticated ? (
            <div className="flex justify-center space-x-3">
              <a 
                href="/Registro" 
                className="px-6 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Registrarse
              </a>
              <a 
                href="/InicioSesion" 
                className="px-6 py-2 border border-gray-400 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Acceder
              </a>
            </div>
          ) : (
            <div className="flex justify-center space-x-3">
              <a 
                href="/dashboard" 
                className="px-6 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Dashboard
              </a>
              <a 
                href="/profile" 
                className="px-6 py-2 border border-gray-400 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Mi Perfil
              </a>
            </div>
          )}
        </div>
      </section>  
    </div>
  );
}
