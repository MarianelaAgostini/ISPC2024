import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Hero = ({ recipesData }) => {
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
  <div className="flex flex-col items-center mb-4 mt-8">
    <h1 className="text-5xl font-bold mb-4">Coctelis</h1>
        {isUserLoggedIn ? (
          <Link to="/AddRecipeForm" className="modal-button btn btn-primary w-full">
            {t('Agregar Receta')}
          </Link>
        ) : (
          <label
						htmlFor="my-modal-4"
						className="modal-button btn btn-primary w-full">
							{t('Inicia sesión para agregar recetas')}
					</label>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recipesData.map((recipe) => {
          return (
            <div key={recipe.id} className="bg-accent p-4 rounded-lg flex flex-col items-center">
              <img src={recipe.imageURL} alt={recipe.name} className="w-80 h-80 mb-2 rounded-lg" />
              <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
              <Link className='link' to={`/item/${recipe.id}`}>{t('Ver detalle')}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Hero;
