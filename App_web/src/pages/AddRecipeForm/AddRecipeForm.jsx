import React, { useState } from 'react';
import { db } from "../../firebase/config";
import { collection, addDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddRecipeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    imageURL: '',
    ingredients: '',
    description: '',
    category: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const recipeRef = collection(db, 'recipes');
      await addDoc(recipeRef, formData);
      toast.success("Receta guardada con éxito");
      setTimeout(() => {
        window.location.href = '/'; // Redirigir al inicio de la aplicación
      }, 2000);
    } catch (error) {
      console.error("Error adding recipe: ", error);
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold mb-6">Agregar Nueva Receta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nombre de la Receta</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="border border-gray-400 rounded-md px-4 py-2 w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="imageURL" className="block text-gray-700 font-bold mb-2">URL de la Imagen</label>
          <input type="text" id="imageURL" name="imageURL" value={formData.imageURL} onChange={handleInputChange} className="border border-gray-400 rounded-md px-4 py-2 w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="ingredients" className="block text-gray-700 font-bold mb-2">Ingredientes</label>
          <textarea id="ingredients" name="ingredients" value={formData.ingredients} onChange={handleInputChange} className="border border-gray-400 rounded-md px-4 py-2 w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Descripción</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="border border-gray-400 rounded-md px-4 py-2 w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Categoría</label>
          <input type="text" id="category" name="category" value={formData.category} onChange={handleInputChange} className="border border-gray-400 rounded-md px-4 py-2 w-full" />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Agregar Receta
        </button>
      </form>
    </div>
  );
};

export default AddRecipeForm;
