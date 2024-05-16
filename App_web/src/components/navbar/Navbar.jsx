import React, { useEffect, useState } from "react";
import { AiFillAlipayCircle, AiOutlineShoppingCart, AiOutlineTranslation, AiOutlineUser } from "react-icons/ai";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../general.css";
import useDarkMode from "../../hooks/useDarkMode";
import { AdminOnlyLink } from "../adminRoute/AdminRoute";
import encabezado from "../../assets/encabezado.png";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { removeActiveUser, setActiveUser } from "../../redux/slice/authSlice";
import { calculateSubtotal, calculateTotalQuantity } from "../../redux/slice/cartSlice";
import { formatPrice } from "../../utils/formatPrice";
import { BsMoonStarsFill } from "react-icons/bs"; 
import i18n from "../../i18n/i18n";
import LanguageSelector from "../language/LanguageSelector";
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { isUserLoggedIn, userName } = useSelector((store) => store.auth);
  const { totalAmount, totalQuantity, cartItems } = useSelector((store) => store.cart);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, setDarkMode] = useDarkMode()
  const { t } = useTranslation();
  const [modoNocturno, setModoNocturno] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (displayName == null) {
          setDisplayName(user.email.split("@")[0]);
        }
        dispatch(
          setActiveUser({
            email: user.email,
            userName: user.displayName ? user.displayName : displayName,
            userId: user.uid,
          })
        );
      } else {
        setDisplayName("");
        dispatch(removeActiveUser());
      }
    });
  }, []);

  function logOutUser() {
    signOut(auth)
      .then(() => {
        toast.success(t('Usuario desconectado'));
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        toast.error(error.code, error.message);
      });
  }  

  const handleChangeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  let activeStyle = {
    borderBottom: "2px solid white",
  };

  useEffect(() => {
    dispatch(calculateTotalQuantity());
    dispatch(calculateSubtotal());
  }, [dispatch, cartItems]);

  return (
    <>
      <nav className="w-screen bg-neutral shadow-xl ">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <section className="md:gap-4">
            <Link to="/" className="btn btn-ghost ">
              <img src={encabezado} alt="encabezado" style={{ maxWidth: '60px' }} />
            </Link>
          </section>
          <div className="flex items-center gap-x-10">
            <ul className="flex items-center gap-x-6">
              <li className="hidden lg:block text-white text-xs md:text-xl m-2">
                <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : null)} end>
                  {t('Inicio')}
                </NavLink>
              </li>
              <li className="hidden lg:block text-white text-xs md:text-xl m-2">
                <NavLink to="/category" style={({ isActive }) => (isActive ? activeStyle : null)} end>
                {t('Categorías')}
                </NavLink>
              </li>
              <li className="hidden lg:block text-white text-xs md:text-xl m-2">
                <NavLink to="/all" style={({ isActive }) => (isActive ? activeStyle : null)}>
                {t('Tienda')}
                </NavLink>
              </li>
              <li className="hidden lg:block text-white text-xs md:text-xl m-2">
                <NavLink to="/SobreNosotros" style={({ isActive }) => (isActive ? activeStyle : null)}>
                {t('Sobre nosotros')}
                </NavLink>
              </li>
              <li className="hidden lg:block text-white text-xs md:text-xl m-2">
                <NavLink to="/contact" style={({ isActive }) => (isActive ? activeStyle : null)}>
                {t('Contacto')}
                </NavLink>
              </li>
              <li className="hidden lg:block text-white text-xs md:text-xl m-2">
                <NavLink to="/faq" style={({ isActive }) => (isActive ? activeStyle : null)}>
                {t('Preguntas frecuentes')}
                </NavLink>
              </li>
              
            </ul>
            <div className="dropdown dropdown-end ">
            <label tabIndex={0} className="btn btn-ghost btn-circle">       
                <div className="indicator">
                    <AiOutlineTranslation size={30} color="white" />
                </div>   
            </label>
            <div
                tabIndex={0}
                className="mt-3 card card-compact dropdown-content w-52 bg-base-100  shadow-xl "
              >
                <div className="card-body bg-neutral flex items-center">
                <span className="badge badge-primary indicator-item"><LanguageSelector handleChangeLanguage={handleChangeLanguage}/></span>
                </div>
              </div>
            
            </div>
              <li className="hidden lg:block text-white text-xs md:text-xl">
                <a href="https://github.com/MarianelaAgostini/ISPC2024" className="text-yellow-500 text-xs md:text-xl font-bold">
                  {t('APP MÓVIL')}
                </a>
              </li>
              <button className="boton" onClick = {() => setDarkMode(prevDarkMode => !prevDarkMode)}>
                <BsMoonStarsFill/>
              </button>
              <div className="dropdown dropdown-end ">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <AiOutlineShoppingCart size={30} color="white" />
                  <span className="badge badge-primary indicator-item">{totalQuantity}</span>
                </div>
              </label>
              <div
                tabIndex={0}
                className="mt-3 card card-compact dropdown-content w-52 bg-base-100  shadow-xl "
              >
                <div className="card-body">
                  <span className="font-bold text-lg">{totalQuantity} Items</span>
                  <span>Subtotal: {formatPrice(totalAmount)}</span>
                  <div className="card-actions">
                    <Link to="/cart" className="btn btn-primary btn-block">
                      {t('Ver carrito')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:hidden">
          <div className="dropdown dropdown-end ml-4">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="rounded-full">
                  <AiFillAlipayCircle size={30} color="white" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 ">
                <div className="block lg:hidden">
                  <li>
                    <Link to="/" className="text-lg ">
                      {t('Inicio')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/category" className="text-lg">
                      {t('Categorias')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/all" className="text-lg ">
                      {t('Tienda')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/SobreNosotros" className="text-lg ">
                      {t('Sobre nosotros')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-lg">
                      {t('Contacto')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-lg">
                      {t('Preguntas frecuentes')}
                    </Link>
                  </li>
                </div>
              </ul>
          </div>
          </div>
          <div className="md:gap-2">     
            <div className="dropdown dropdown-end m-10">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="rounded-full">
                  <AiOutlineUser size={30} color="white" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 "
              >
                {userName && (
                  <li className="bg-primary text-gray-200">
                    <p className="block">
                      {t('Bienvenido,')} <span className="font-bold">{userName}</span>
                    </p>
                  </li>
                )}
                {isUserLoggedIn ? (
                  <div>
                    <li>
                      <Link to="/my-orders" className="text-lg text-primary">
                        {t('Mis órdenes')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/EditarPerfil" className="text-lg text-primary">
                        {t('Editar Perfil')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/"
                        className="flex justify-between hover:bg-red-100  text-red-500 text-lg"
                        onClick={logOutUser}
                      >
                        {t('Cerrar sesión')}
                      </Link>
                    </li>
                  </div>
                ) : (
                  <li>
                    <label htmlFor="my-modal-4" className="modal-button text-lg text-primary">
                      {t('Iniciar sesión')}
                    </label>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <AdminOnlyLink>
        <div className="min-w-screen h-10  py-1 bg-red-200 text-red-700 font-bold text-center cursor-pointer">
          <span>{t('Administrador')}</span>
          <Link to="/admin/home" className="btn btn-primary btn-sm mx-4">
            {t('Ver Dashboard')}
          </Link>
        </div>
      </AdminOnlyLink>
      
    </>
  );
};

export default Navbar;
