import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useDarkMode from "../../hooks/useDarkMode";

const Hero = ({ recipesData }) => {
  const { t } = useTranslation();
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);
  const darkMode = useDarkMode(); // Llamar una vez para evitar reevaluaciones

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-${darkMode ? 'dark' : 'neutral'}flex flex-col items-center justify-center min-h-screen`}>
      <div className="flex flex-col items-center mb-4 mt-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Coctelis</h1>
        {isUserLoggedIn ? (
          <Link to="/AddRecipeForm" className="modal-button btn btn-primary w-full md:w-auto mb-4 md:mb-0">
            {t('Agregar Receta')}
          </Link>
        ) : (
          <label
            htmlFor="my-modal-4"
            className="modal-button btn btn-primary w-full md:w-auto mb-4 md:mb-0">
            {t('Inicia sesión para agregar recetas')}
          </label>
        )}
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 bg-${darkMode ? 'dark' : 'neutral'}`}>
        {recipesData.map((recipe) => (
          <div key={recipe.id} className={`bg-accent p-4 rounded-lg flex flex-col items-center mb-2 bg-${darkMode ? 'dark' : 'neutral'}`}>
            <img src={recipe.imageURL} alt={recipe.name} className="w-full h-full md:max-w-xs mb-2 rounded-lg" />
            <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
            <Link className='link modal-button btn neutral w-full md:w-auto mb-4 md:mb-0' to={`/item/${recipe.id}`}>{t('Ver detalle')}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
