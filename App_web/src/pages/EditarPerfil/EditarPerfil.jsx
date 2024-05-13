import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const UserProfile = () => {
  const userId = "Y8JiU3VI0CMr5xx0yNWZ2tl00iO2"; 
 

  const [userData, setUserData] = useState({
    userId: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
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

    fetchUserData();
  }, [userId]);

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
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, userData);
      toast.success("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Error updating user data");
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
              />
            </div>
            <div className="mt-4">
              <label className="label-text font-bold mb-2 block">Teléfono</label>
              <input
                className="input input-bordered w-full border-2"
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-4 w-full flex items-center justify-center">
              <button type="submit" className="btn">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
