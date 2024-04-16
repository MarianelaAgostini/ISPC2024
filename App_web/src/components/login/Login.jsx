import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../loader/Loader";
//Firebase
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

//Función para testear el login.
  const testLogin = (e) => {
    e.preventDefault();
    document.getElementById("my-modal-4").checked = false;

    let testEmail = import.meta.env.VITE_TEST_EMAIL;
    let testPass = import.meta.env.VITE_TEST_PASSWORD;
    setIsLoading(true);
    signInWithEmailAndPassword(auth, testEmail, testPass)
      .then((userCredential) => {
        const user = userCredential.user;
        toast.success("Login Successful");
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.code, error.message);
        setIsLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Cerrar ventana de diálogo cuando se presiona el botón
    document.getElementById("my-modal-4").checked = false;

    // Login de usuario personalizado (no de testeo)
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        toast.success("Login Successful");
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.code, error.message);
        setIsLoading(false);
      });

    setEmail("");
    setPassword("");
  };

  // Login con Google
  const provider = new GoogleAuthProvider();
  const googleSignIn = () => {
    setIsLoading(true);
    document.getElementById("my-modal-4").checked = false;
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        toast.success("Login Successful");
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.code, error.message);
        setIsLoading(false);
      });
  };

  const AllFieldsRequired = Boolean(email) && Boolean(password);

  return (
    <>
      {isLoading && <Loader />}
      <div className="py-6 ">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-4xl">
          <div className="w-full px-8 pt-4 pb-6">
            <p className="text-xl text-gray-600 text-center">Bienvenido de nuevo</p>
            <div className="btn w-full mt-4 gap-2" onClick={googleSignIn}>
              <FcGoogle size={22} />
              Iniciar sesión con Google
            </div>
            <div className="divider text-xs text-gray-400 uppercase">O ingresa con email</div>
            <form className="form-control" onSubmit={handleSubmit}>
              <div>
                <label className="label-text font-bold mb-2 block">Email</label>
                <input
                  className="input input-bordered w-full border-2"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-4 relative">
                <div className="flex justify-between">
                  <label className="label-text font-bold mb-2">Contraseña</label>
                  <Link
                    to="/reset"
                    className="text-xs text-gray-500"
                    onClick={() => (document.getElementById("my-modal-4").checked = false)}
                  >
                    ¿Olvidaste la contraseña?
                  </Link>
                </div>
                <input
                  className="input input-bordered w-full border-2 "
                  type={`${showPassword ? "test" : "password"}`}
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
              <div className="mt-4 w-full flex flex-col items-center justify-center">
                <button type="submit" className="btn w-full" disabled={!AllFieldsRequired}>
                  Login
                </button>

                {/* Botón para testear el modal */}
                {/* <label
                  onClick={testLogin}
                  htmlFor="my-modal-69"
                  className="btn btn-info btn-sm mt-2"
                >
                  Test User
                </label> */}

                {/* poner esto antes del </body> si se quiere probar */}
                <input type="checkbox" id="my-modal-69" className="modal-toggle" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
