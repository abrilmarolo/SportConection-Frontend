import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';

export function Contact() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');

    try {
      // Configuración de EmailJS desde variables de entorno
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Parámetros del template
      const templateParams = {
        from_name: form.nombre,
        from_email: form.email,
        subject: form.asunto,
        message: form.mensaje,
        to_email: 'sportconection.info@gmail.com'
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setEnviado(true);
      setForm({ nombre: '', email: '', asunto: '', mensaje: '' });
    } catch (err) {
      console.error('Error al enviar email:', err);
      setError('Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente o escríbenos directamente a sportconection.info@gmail.com');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className='mt-5 min-h-screen'>
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
            <motion.button
              onClick={() => setEnviado(false)}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enviar otro mensaje
            </motion.button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
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
              <label htmlFor="asunto" className="block text-gray-700 dark:text-gray-200 mb-2">
                Asunto
              </label>
              <input
                type="text"
                id="asunto"
                name="asunto"
                value={form.asunto}
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
            <motion.button
              type="submit"
              disabled={enviando}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="w-full py-2 rounded-3xl text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {enviando ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </span>
              ) : (
                'Enviar Consulta'
              )}
            </motion.button>
          </form>
          </>
        )}
      </div>
    </section>
  );
}
