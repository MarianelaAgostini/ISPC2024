import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ recipesData }) => {
  return (
    <div>
      <h1 className="text-5xl font-bold text-center mt-4 mb-8">Coctelis</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recipesData.map((recipe) => {
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

export default Hero;
