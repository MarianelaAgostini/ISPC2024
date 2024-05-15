import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Importa Link
import { db } from "../../firebase/config";
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import useDarkMode from "../../hooks/useDarkMode";

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { t } = useTranslation();
  const darkMode = useDarkMode();

  useEffect(() => {
    async function fetchItem() {
      const docRef = doc(db, "recipes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setItem({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
    }

    fetchItem();
  }, [id]);

  if (!item) {
    return <div>{t('Cargando...')}</div>;
  }

  return (
    <div className={`bg-${darkMode ? 'dark' : 'neutral'}`}>
      <div className={`rounded-lg shadow-lg p-6 flex flex-col items-center bg-${darkMode ? 'dark' : 'neutral'}`}>
        <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
        <img src={item.imageURL} alt={item.name} className="w-80 h-80 object-cover mb-4 rounded-lg"></img>
        <p className="text-xl font-semibold mb-2">{t('Ingredientes')}</p>
        <h2 className="text-gray-700 mb-2">{item.ingredients}</h2>
        <p className="text-xl font-semibold mb-2">{t('Descripción')}</p>
        <p className="text-gray-700 mb-2">{item.description}</p>
        <p className="text-xl font-semibold mb-2">{t('Categoría')}</p>
        <p className="text-gray-500">{t(item.category)}</p>
        <Link to={`/itemedit/${id}`} className="modal-button btn btn-primary w-full">{t('Editar')}</Link>
      </div>
    </div>
  );
};

export default ItemDetail;
