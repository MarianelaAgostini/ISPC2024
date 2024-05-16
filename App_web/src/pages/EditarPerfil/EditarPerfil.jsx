import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db, auth } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const userDocRef = doc(db, "users", userId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userDataFromFirestore = docSnap.data();
          setUserData(userDataFromFirestore);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting user document:", error);
        toast.error("Error getting user data");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
      } else {
        console.log("User is not logged in");
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
        toast.error("Todos los campos son obligatorios");
        return;
      }

      if (!/^\d+$/.test(userData.phone)) {
        toast.error("El campo de teléfono solo puede contener caracteres numéricos");
        return;
      }

      setIsSaving(true);

      if (userId) {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, userData);
        toast.success("Datos de usuario actualizados correctamente");

        // Esperar 1 segundo antes de redirigir al usuario al inicio
        setTimeout(() => {
          setIsSaving(false);
          navigate("/"); // Redirigir al usuario a la página de inicio
        }, 1000);
      } else {
        toast.error("No hay ningún usuario conectado");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
      toast.error("Error al actualizar los datos del usuario");
    }
  };

  return (
    <div className="py-6">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-4xl">
        <div className="w-full px-8 pt-4 pb-6">
          <p className="text-xl text-gray-600 text-center">Perfil de Usuario</p>
          <form className="form-control" onSubmit={handleSubmit}>
            <div>
              <label className="label-text font-bold mb-2 block">Email</label>
              <input
                className="input input-bordered w-full border-2"
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mt-4">
              <label className="label-text font-bold mb-2 block">Nombre</label>
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
              <label className="label-text font-bold mb-2 block">Apellido</label>
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
              <label className="label-text font-bold mb-2 block">Teléfono</label>
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
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </button>
              <Link to="/" className="btn ml-4">Cancelar</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
