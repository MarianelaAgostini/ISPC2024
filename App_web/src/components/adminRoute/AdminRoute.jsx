import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { email } = useSelector((store) => store.auth);
  if (email === import.meta.env.VITE_ADMIN_KEY) return children;
  return (
    <section className="flex flex-col items-center justify-center w-full page gap-5">
      <h2 className="text-4xl font-bold">PERMISOS DENEGADOS</h2>
      <p className="text-xl">Esta página solo puede ser vista por un administrador.</p>
      <Link to="/" className="btn btn-error btn-outline btn-lg">
        &larr; Volver a inicio
      </Link>
    </section>
  );
};

export const AdminOnlyLink = ({ children }) => {
  const { email } = useSelector((store) => store.auth);
  if (email === import.meta.env.VITE_ADMIN_KEY) return children;
  return null;
};

export default AdminRoute;
