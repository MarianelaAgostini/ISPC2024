import React, { useEffect, useState } from 'react';
import Home from '../../pages/home/Home';

const Hero = ({ recipesData }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recipesData.map((recipe) => {
          return (
            <div key={recipe.id} className="bg-gray-100 p-4 rounded-lg">
              <img src={recipe.imageURL} alt={recipe.name} className="w-full mb-2 rounded-lg" />
              <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Hero;
