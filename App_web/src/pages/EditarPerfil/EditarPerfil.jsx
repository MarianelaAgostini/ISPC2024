import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db, auth } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const userDocRef = doc(db, "users", userId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userDataFromFirestore = docSnap.data();
          setUserData(userDataFromFirestore);
        } else {
          console.log(t('¡No existe tal documento!'));
        }
      } catch (error) {
        console.error(t('Error al obtener el documento del usuario'), error);
        toast.error(t('Error al obtener los datos del usuario'));
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
      } else {
        console.log(t('El usuario no ha iniciado sesión'));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userData.email || !userData.firstName || !userData.lastName || !userData.phone) {
        toast.error(t('Todos los campos son obligatorios'));
        return;
      }

      if (!/^\d+$/.test(userData.phone)) {
        toast.error(t('El campo de teléfono solo puede contener caracteres numéricos'));
        return;
      }

      setIsSaving(true);

      if (userId) {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, userData);
        toast.success(t('Datos de usuario actualizados correctamente'));

        setTimeout(() => {
          setIsSaving(false);
          navigate("/");
        }, 1000);
      } else {
        toast.error(t('No hay ningún usuario conectado'));
      }
    } catch (error) {
      console.error(t('Error al actualizar los datos del usuario'), error);
      toast.error(t('Error al actualizar los datos del usuario'));
    }
  };

  return (
    <div className="py-6">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-4xl">
        <div className="w-full px-8 pt-4 pb-6">
          <p className="text-xl text-gray-600 text-center">{t('Perfil de Usuario')}</p>
          <form className="form-control" onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="label-text font-bold mb-2 block">{t('Nombre')}</label>
              <input
                className="input input-bordered w-full border-2"
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mt-4">
              <label className="label-text font-bold mb-2 block">{t('Apellido')}</label>
              <input
                className="input input-bordered w-full border-2"
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mt-4">
              <label className="label-text font-bold mb-2 block">{t('Teléfono')}</label>
              <input
                className="input input-bordered w-full border-2"
                type="text"
                name="phone"
                value={userData.phone}
                onChange={(e) => {
                  const { value } = e.target;
                  if (/^\d*$/.test(value)) {
                    setUserData((prevData) => ({
                      ...prevData,
                      phone: value
                    }));
                  }
                }}
                required
              />
            </div>
            <div className="mt-4 w-full flex items-center justify-center">
              <button type="submit" className="btn" disabled={isSaving}>
                {isSaving ? t('Guardando...') : t('Guardar cambios')}
              </button>
              <Link to="/" className="btn ml-4">{t('Cancelar')}</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
