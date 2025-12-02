import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    question: "¿Cómo puedo crear una cuenta?",
    answer: "Puedes registrarte haciendo clic en 'Registrarse 'en la página principal. El proceso tiene dos pasos:\n\n1- Ingresa tu email y crea una contraseña. \n\n2- Selecciona tu tipo de perfil (Atleta, Representante o Equipo) y completa la información específica.",
  },
   {
    question: "¿Qué tipos de cuenta puedo crear?",
    answer: "Puedes crear tres tipos de cuenta: Atleta, Representante y Equipo. Cada tipo de cuenta tiene características y funcionalidades específicas para satisfacer tus necesidades.",
  },
  {
    question: "¿Puedo cambiar mi tipo de cuenta después del registro?",
    answer: "No, el tipo de cuenta se establece durante el registro y no puede modificarse posteriormente.",
  },
  {
    question: "¿Cómo puedo encontrar grupos de interés?",
    answer: "Dentro de la plataforma, accede a la sección de 'Grupos' y utiliza el buscador para encontrar grupos relacionados con tus intereses deportivos. Puedes unirte y participar en las conversaciones.",
  },
  {
    question: "¿Es gratuito usar SportConnection?",
    answer: "Sí, la plataforma es completamente gratuita para todos los usuarios",
  },
  {
    question: "¿Puedo eliminar mi cuenta?",
    answer: "Sí, puedes eliminar tu cuenta permanentemente desde la configuración de tu perfil.",
  },
  {
    question: "¿Hay aplicación móvil?",
    answer: "Sí, puedes encontrarla en PlayStore",
  },
];

export function FrequentQuestions() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
 
      <section className="container mx-auto px-4 my-8">
        <h1 className="text-3xl md:text-4xl font-medium text-gray-800 dark:text-white mb-8 text-center">
          Preguntas Frecuentes
        </h1>
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <motion.div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <button
                className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
                onClick={() => handleToggle(idx)}
              >
                <span className="text-lg font-medium text-gray-800 dark:text-white">{q.question}</span>
                <motion.svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                      {q.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
   
  );
}
