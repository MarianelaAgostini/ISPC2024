import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, auth } from "../../firebase/config";
import { doc, getDoc, onSnapshot, updateDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import useDarkMode from "../../hooks/useDarkMode";
import { AiOutlineLike, AiOutlineDislike, AiOutlineSend } from "react-icons/ai";
import copy from 'copy-to-clipboard';
import { onAuthStateChanged } from "firebase/auth";

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { t } = useTranslation();
  const darkMode = useDarkMode();
  const url = window.location.href; // Obtener la URL actual
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().rol === 'admin');
        }
      } else {
        setIsAdmin(false);
      }
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const docRef = doc(db, "recipes", id);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setItem({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("¡No existe tal documento!");
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (!item) {
    return <div>{t('Cargando...')}</div>;
  }

  const handleVote = async (voteType) => {
    // Verificar si el usuario ha iniciado sesión
    if (!auth.currentUser) {
      alert(t('Por favor inicia sesión para votar'));
      return;
    }
  
    const votesCollection = collection(db, "votes");
    const q = query(votesCollection, where("userId", "==", auth.currentUser.uid), where("recipeId", "==", id));
    const querySnapshot = await getDocs(q);
  
    const docRef = doc(db, "recipes", id);
    const recipeSnapshot = await getDoc(docRef);
    const recipeData = recipeSnapshot.data();
  
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (voteDoc) => {
        const voteData = voteDoc.data();
        if (voteData.voteType === voteType) {
          await deleteDoc(voteDoc.ref);
          await updateDoc(docRef, { [voteType]: (recipeData[voteType] || 0) - 1 });
        } else {
          await deleteDoc(voteDoc.ref);
          await addDoc(votesCollection, { userId: auth.currentUser.uid, recipeId: id, voteType });
          await updateDoc(docRef, {
            [voteData.voteType]: (recipeData[voteData.voteType] || 0) - 1,
            [voteType]: (recipeData[voteType] || 0) + 1,
          });
        }
      });
    } else {
      await addDoc(votesCollection, { userId: auth.currentUser.uid, recipeId: id, voteType });
      await updateDoc(docRef, { [voteType]: (recipeData[voteType] || 0) + 1 });
    }
  };
  

  const handleShare = () => {
    copy(url); // Copiar la URL al portapapeles
    alert(t('URL de la receta copiada al portapapeles'));
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
        <div className="mb-4 flex gap-4">
          <button onClick={() => handleVote('likes')} className="btn btn-primary">
            <AiOutlineLike /> {t('Me gusta')} {item.likes || 0}
          </button>
          <button onClick={() => handleVote('dislikes')} className="btn btn-primary">
            <AiOutlineDislike /> {t('No me gusta')} {item.dislikes || 0}
          </button>
          <button onClick={handleShare} className="btn btn-primary">
            <AiOutlineSend />{t('Compartir')}
          </button>
          {isAdmin && (
            <Link to={`/itemedit/${id}`} className="btn btn-primary">
              {t('Editar')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
