import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

const ViewCategory = ({ recipesData }) => {
  const { categoryName } = useParams();


  // Filtrar las recetas por categoría
  const filteredRecipes = recipesData.filter(recipe => recipe.category === categoryName);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center mb-4 mt-8">
        <h1 className="text-5xl font-bold mb-4">{categoryName}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => {
          return (
            <div key={recipe.id} className="bg-accent p-4 rounded-lg flex flex-col items-center">
              <img src={recipe.imageURL} alt={recipe.name} className="w-80 h-80 mb-2 rounded-lg" />
              <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
              <Link className='link' to={`/item/${recipe.id}`}>Ver detalle</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewCategory;
