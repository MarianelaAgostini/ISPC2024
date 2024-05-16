import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('¿Cómo puedo agregar una receta?'),
      answer: t('Para agregar una receta, primero debes iniciar sesión en tu cuenta. Luego, haz clic en Agregar Receta en la página principal.'),
    },
    {
      question: t('¿Es gratis usar Coctelis?'),
      answer: t('Sí, usar Coctelis es completamente gratis. Puedes explorar recetas y agregar las tuyas sin ningún costo.'),
    },
    {
      question: t('¿Cómo puedo editar o eliminar una receta que he agregado?'),
      answer: t('Para editar o eliminar una receta, ve a tu perfil y selecciona la receta que deseas modificar o eliminar.'),
    },
    {
      question: t('¿Qué hago si olvidé mi contraseña?'),
      answer: t('Si olvidaste tu contraseña, haz clic en ¿Olvidaste tu contraseña? en la página de inicio de sesión y sigue las instrucciones para restablecerla.'),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-5xl font-bold mb-8">{t('Preguntas frecuentes')}</h1>
      <div className="w-full max-w-4xl">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-accent p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
      <Link to="/contact" className="btn btn-primary mt-4">{t('Si tienes otras dudas, ¡contáctanos!')}</Link>
    </div>
  );
};

export default FAQ;
