import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../loader/Loader";
//Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t('Las contraseñas no coinciden'));
      return;
    }
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        toast.success(t('Registro exitoso'));

        // Guardar datos del usuario en Firestore
        const userRef = doc(db, "users", user.uid);
        setDoc(userRef, {
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          rol: "user",
        })
          .then(() => {
            setIsLoading(false);
            document.getElementById("my-modal-4").checked = false;
            navigate("/");
          })
          .catch((error) => {
            console.error(t('Error al guardar datos del usuario: '), error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        toast.error(error.code, error.message);
        setIsLoading(false);
      });

    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
  };

  const AllFieldsRequired = Boolean(email) && Boolean(password) && Boolean(confirmPassword) && Boolean(firstName) && Boolean(lastName) && Boolean(phone);

  return (
    <>
      {isLoading && <Loader />}
      <div className="py-6 w-72 md:w-96">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-4xl">
          <div className="w-full px-8 pt-4 pb-6">
            <p className="text-lg text-gray-600 text-center">{t('Crear nueva cuenta')}</p>

            <form onSubmit={handleSubmit} className="form-control">
              <div>
                <label className="label-text font-bold mb-2 block">{t('Dirección de correo')}</label>
                <input
                  className="input input-bordered w-full border-2 "
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="label-text font-bold mb-2 block">{t('Nombre')}</label>
                <input
                  className="input input-bordered w-full border-2"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="label-text font-bold mb-2 block">{t('Apellido')}</label>
                <input
                  className="input input-bordered w-full border-2"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="label-text font-bold mb-2 block">{t('Teléfono')}</label>
                <input
                  className="input input-bordered w-full border-2"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="mt-4 relative">
                <div className="flex justify-between">
                  <label className="label-text font-bold mb-2">{t('Contraseña')}</label>
                </div>
                <input
                  className="input input-bordered w-full border-2"
                  type={`${showPassword ? "text" : "password"}`}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (
                    <AiFillEye className="absolute top-10 right-3 " size={26} color="gray" />
                  ) : (
                    <AiFillEyeInvisible
                      className="absolute top-10 right-3 "
                      size={26}
                      color="gray"
                    />
                  )}
                </span>
              </div>
              <div className="mt-4">
                <label className="label-text font-bold mb-2">{t('Confirmar contraseña')}</label>
                <input
                  className="input input-bordered w-full border-2"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <button type="submit" className="btn w-full" disabled={!AllFieldsRequired}>
                  {t('Registrarse')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
