import React from 'react'

export function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 my-4">
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">

            <h1 className="text-3xl md:text-4xl font-medium text-gray-800 dark:text-white mb-4">
              Sobre Nosotros
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Descubre la historia, propósito y visión detrás de SportConnection.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 dark:bg-gray-800 py-12 text-center">
        <div className="container mx-auto px-4 ">
          <h2 className="text-2xl font-normal text-center mb-8 text-gray-800 dark:text-white">
            Nuestra Misión
          </h2>

          <p className="text-gray-700 dark:text-gray-300 text-lg">
            En SportConnect, nuestra misión es conectar a profesionales y aficionados del deporte de todo el mundo. Creemos en el poder del deporte para unir a las personas, fomentar la colaboración y crear oportunidades. Nuestra plataforma está diseñada para facilitar la interacción, el intercambio de conocimientos y el crecimiento profesional dentro de la industria del deporte.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-normal text-center mb-8 text-gray-800 dark:text-white">
            ¿Cómo Funciona?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            SportConnect ofrece una variedad de funciones para ayudarte a conectarte con otros profesionales y aficionados del deporte. Puedes crear un perfil detallado, unirte a grupos de interés, participar en discusiones, compartir contenido y buscar oportunidades de empleo. Nuestra plataforma está diseñada para ser intuitiva y fácil de usar, permitiéndote aprovechar al máximo tu experiencia.
          </p>

        </div>
      </section>
      <section className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-normal text-center mb-8 text-gray-800 dark:text-white">
            ¿Qué Queremos Lograr?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Queremos ser el puente entre el talento y las oportunidades, facilitando el acceso a recursos, visibilidad y contactos profesionales. Nuestra meta es crear un ecosistema donde el deporte sea inclusivo, accesible y lleno de posibilidades para todos.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-normal text-center mb-12 text-gray-800 dark:text-white">
            Nuestro Equipo
          </h2>
          <div className="grid md:grid-cols-4 gap-8  mx-auto">
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-1 text-gray-800 dark:text-white">Valentino Cortese</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Desarrollador Backend</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-1 text-gray-800 dark:text-white">Abril Marolo</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Desarrolladora Frontend</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-1 text-gray-800 dark:text-white">Lucas Canavese</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Desarrollador Frontend</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-1 text-gray-800 dark:text-white">Bautista Paz</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Desarrollador Backend</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-normal mb-4">¿Quieres ser parte de SportConnection?</h2>
          <p className="-300 mb-8 max-w-2xl mx-auto">
            Contáctanos y únete a nuestra misión de transformar el deporte profesional.
          </p>
          <a
            href="/Contacto"
            className="px-6 py-2 rounded-3xl text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 transition-colors text-sm font-medium"
          >
            Contactar
          </a>
        </div>
      </section>
    </div>
  );
}
