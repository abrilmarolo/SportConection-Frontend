import React from 'react'

export function AboutUs(){
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 my-5">
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🤸‍♂️</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-800 dark:text-white mb-4">
              Sobre Nosotros
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Descubre la historia, propósito y visión detrás de SportConnection.
            </p>
          </div>
        </div>
      </section>

      {/* Historia Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-light text-center mb-8 text-gray-800 dark:text-white">
            Nuestra Historia
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            SportConnection nació en 2023 como respuesta a la necesidad de una plataforma que uniera a la comunidad deportiva profesional y amateur. Inspirados por la pasión por el deporte y la tecnología, nuestro equipo se propuso crear un espacio donde atletas, representantes y equipos pudieran conectarse, crecer y alcanzar nuevas oportunidades.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Desde nuestros inicios, hemos trabajado para derribar barreras y facilitar el acceso a recursos, visibilidad y networking en el mundo deportivo. Hoy, SportConnection es una comunidad global que sigue expandiéndose y evolucionando junto a sus usuarios.
          </p>
        </div>
      </section>

      {/* Propósito y Visión Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-light text-center mb-8 text-gray-800 dark:text-white">
            Nuestro Propósito
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            Nuestro propósito es impulsar el desarrollo deportivo, brindando herramientas y oportunidades para que cada miembro de la comunidad alcance su máximo potencial. Creemos en el poder de la conexión y la colaboración para transformar vidas y carreras.
          </p>
          <h2 className="text-2xl font-light text-center mb-8 text-gray-800 dark:text-white">
            ¿Qué Queremos Lograr?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Queremos ser el puente entre el talento y las oportunidades, facilitando el acceso a recursos, visibilidad y contactos profesionales. Nuestra meta es crear un ecosistema donde el deporte sea inclusivo, accesible y lleno de posibilidades para todos.
          </p>
        </div>
      </section>

      {/* Valores Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-light text-center mb-8 text-gray-800 dark:text-white">
            Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-3 dark:text-white">Compromiso</h3>
              <p className="text-gray-600 dark:text-gray-300">Nos dedicamos a apoyar a cada usuario en su camino deportivo.</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-3 dark:text-white">Transparencia</h3>
              <p className="text-gray-600 dark:text-gray-300">Fomentamos relaciones honestas y abiertas entre todos los miembros.</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-3 dark:text-white">Excelencia</h3>
              <p className="text-gray-600 dark:text-gray-300">Buscamos la mejora continua y la calidad en cada aspecto de la plataforma.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-light text-center mb-12 text-gray-800 dark:text-white">
            Nuestro Equipo
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg">🧑‍💼</span>
              </div>
              <h3 className="text-lg font-medium mb-1 text-gray-800 dark:text-white">Lucas Fernández</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Fundador & CEO</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg">👩‍💻</span>
              </div>
              <h3 className="text-lg font-medium mb-1 text-gray-800 dark:text-white">María Gómez</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">CTO</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg">🤝</span>
              </div>
              <h3 className="text-lg font-medium mb-1 text-gray-800 dark:text-white">Carlos Pérez</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Head of Community</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-light mb-4 text-white">¿Quieres ser parte de SportConnection?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contáctanos y únete a nuestra misión de transformar el deporte profesional.
          </p>
          <a 
            href="/Contacto" 
            className="px-6 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            Contactar
          </a>
        </div>
      </section>
    </div>
  );
}
