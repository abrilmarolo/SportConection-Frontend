import React, { useState } from 'react';

export function Contact() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setForm({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <section className='mt-5'>
        <div className="container mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-medium text-gray-800 dark:text-white mb-4">
            Contactactanos
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4  mx-auto">
            ¡Estamos aquí para ayudarte! Por favor, completa el formulario a continuación para enviarnos un mensaje o pregunta.
          </p>
        </div>
    
    
      <div className="max-w-md mx-auto p-6 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">

        {enviado ? (
          <div className="text-center">
            <span className="text-2xl">✅</span>
            <h2 className="text-xl font-medium text-gray-800 dark:text-white mt-4 mb-2">¡Gracias por tu consulta!</h2>
            <p className="text-gray-600 dark:text-gray-300">Nos pondremos en contacto contigo a la brevedad.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-gray-700 dark:text-gray-200 mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="mensaje" className="block text-gray-700 dark:text-gray-200 mb-2">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                required
                rows={5}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-3xl text-white bg-blue-500 hover:bg-blue-700"
            >
              Enviar Consulta
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
