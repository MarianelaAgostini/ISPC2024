import React, { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../loader/Loader";
//Firebase
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useDispatch } from "react-redux";
import { setRole } from "../../redux/slice/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    document.getElementById("my-modal-4").checked = false;
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.data().rol;
        dispatch(setRole(role)); // Despacha la acción setRole con el rol del usuario
        toast.success("Login Successful");
        setIsLoading(false);
        if (role === "admin") {
          navigate("/admin/home");
        } else {
          navigate("/");
        }
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