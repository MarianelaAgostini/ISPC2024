import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ViewCategory = ({ recipesData }) => {
  const { categoryName } = useParams();
  const { t } = useTranslation();


  // Filtrar las recetas por categoría
  const filteredRecipes = recipesData.filter(recipe => recipe.category === categoryName);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center mb-4 mt-8">
        <h1 className="text-5xl font-bold mb-4">{t(categoryName)}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => {
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

export default ViewCategory;
