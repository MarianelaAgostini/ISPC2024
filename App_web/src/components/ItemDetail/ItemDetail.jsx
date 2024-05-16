import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from "../../firebase/config";
import { doc, getDoc, onSnapshot, updateDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import useDarkMode from "../../hooks/useDarkMode";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { t } = useTranslation();
  const darkMode = useDarkMode();

  // Aquí debes obtener el ID del usuario actualmente autenticado
  const userId = "user-id"; // Reemplaza esto con la lógica para obtener el userId autenticado

  useEffect(() => {
    const docRef = doc(db, "recipes", id);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setItem({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
    });

    // Cleanup function to unsubscribe from the snapshot listener when el componente se desmonta
    return () => unsubscribe();
  }, [id]);

  if (!item) {
    return <div>{t('Cargando...')}</div>;
  }

  const handleVote = async (voteType) => {
    const votesCollection = collection(db, "votes");
    const q = query(votesCollection, where("userId", "==", userId), where("recipeId", "==", id));
    const querySnapshot = await getDocs(q);

    const docRef = doc(db, "recipes", id);
    const recipeSnapshot = await getDoc(docRef);
    const recipeData = recipeSnapshot.data();

    if (!querySnapshot.empty) {
      // El usuario ya ha votado
      querySnapshot.forEach(async (voteDoc) => {
        const voteData = voteDoc.data();
        if (voteData.voteType === voteType) {
          // Si el voto es del mismo tipo, elimínalo (destildar)
          await deleteDoc(voteDoc.ref);
          await updateDoc(docRef, { [voteType]: (recipeData[voteType] || 0) - 1 });
        } else {
          // Si el voto es del tipo contrario, elimina el anterior y agrega el nuevo
          await deleteDoc(voteDoc.ref);
          await addDoc(votesCollection, { userId, recipeId: id, voteType });
          await updateDoc(docRef, {
            [voteData.voteType]: (recipeData[voteData.voteType] || 0) - 1,
            [voteType]: (recipeData[voteType] || 0) + 1,
          });
        }
      });
    } else {
      // El usuario no ha votado, así que agregamos un voto
      await addDoc(votesCollection, { userId, recipeId: id, voteType });
      await updateDoc(docRef, { [voteType]: (recipeData[voteType] || 0) + 1 });
    }
  };

  return (
    <div className={`bg-${darkMode ? 'dark' : 'neutral'}`}>
      <div className={`rounded-lg shadow-lg p-6 flex flex-col items-center bg-${darkMode ? 'dark' : 'neutral'}`}>
        <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
        <img src={item.imageURL} alt={item.name} className="w-80 h-80 object-cover mb-4 rounded-lg" />
        <p className="text-xl font-semibold mb-2">{t('Ingredientes')}</p>
        <h2 className="text-gray-700 mb-2">{item.ingredients}</h2>
        <p className="text-xl font-semibold mb-2">{t('Descripción')}</p>
        <p className="text-gray-700 mb-2">{item.description}</p>
        <p className="text-xl font-semibold mb-2">{t('Categoría')}</p>
        <p className="text-gray-500 mb-4">{t(item.category)}</p>
        <div className="mb-4">
    <button onClick={() => handleVote('likes')}>
      <AiOutlineLike /> {t('Me gusta')} {item.likes || 0}
    </button>
    <button onClick={() => handleVote('dislikes')}>
      <AiOutlineDislike /> {t('No me gusta')} {item.dislikes || 0}
    </button>
  </div>
        <Link to={`/itemedit/${id}`} className="modal-button btn btn-primary w-full">{t('Editar')}</Link>
      </div>
    </div>
  );
};

export default ItemDetail;
