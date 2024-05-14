import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

const ItemEdit = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchItem() {
      const docRef = doc(db, "recipes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setItem(data);
        setEditedItem({ ...data });
      } else {
        console.log("No such document!");
      }
    }

    fetchItem();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({
      ...editedItem,
      [name]: value
    });
  };

  const handleUpdateItem = async () => {
    try {
      const docRef = doc(db, "recipes", id);
      await updateDoc(docRef, editedItem);
      setItem({ ...editedItem });
      setUpdateSuccess(true);
      console.log("Document updated successfully!");
      // Establecer un temporizador para ocultar el mensaje después de 2 segundos
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteItem = async () => {
    try {
      const docRef = doc(db, "recipes", id);
      await deleteDoc(docRef);
      toast.success("Receta eliminada con éxito");
      setTimeout(() => {
        window.location.href = '/'; // Redirigir al inicio de la aplicación
      }, 2000);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  if (!item) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="h-screen w-200 bg-accent flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">{t('Información de la Receta')}</h1>
        <form className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                {t('Nombre de la Receta')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={editedItem.name}
                onChange={handleInputChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="image">
                {t('URL de la Imagen')}
              </label>
              <input
                id="image"
                name="imageURL"
                type="text"
                value={editedItem.imageURL}
                onChange={handleInputChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="ingredients">
                {t('Ingredientes')}
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={editedItem.ingredients}
                onChange={handleInputChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              ></textarea>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                {t('Descripción')}
              </label>
              <textarea
                id="description"
                name="description"
                value={editedItem.description}
                onChange={handleInputChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              ></textarea>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="category">
                {t('Categoría')}
              </label>
              <select
                id="category"
                name="category"
                value={editedItem.category}
                onChange={handleInputChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              >
              <option value="">{t('Selecciona una categoría')}</option>
              <option value="opcion1">{t('opcion1')}</option>
              <option value="opcion2">{t('opcion2')}</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={handleUpdateItem}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {t('Guardar Cambios')}
          </button>
          <button
            type="button"
            onClick={handleDeleteItem}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            {t('Eliminar Receta')}
          </button>
          <ToastContainer />
          {updateSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">{t('¡Actualización Exitosa!')}</strong>
              <span className="block sm:inline"> {t('Los cambios se han guardado correctamente')}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ItemEdit;
