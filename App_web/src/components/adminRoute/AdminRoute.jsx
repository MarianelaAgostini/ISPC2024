import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { role } = useSelector((store) => store.auth); // Recupera el rol del usuario desde el estado de Redux
  if (role === "admin") return children; // Si el usuario es un administrador, renderiza los componentes hijos
  return (
    <section className="flex flex-col items-center justify-center w-full page gap-5">
      <h2 className="text-4xl font-bold">PERMISOS DENEGADOS</h2>
      <p className="text-xl">Esta página solo puede ser vista por un administrador.</p>
      <Link to="/" className="btn btn-error btn-outline btn-lg">
        ← Volver a inicio
      </Link>
    </section>
  );
};

export const AdminOnlyLink = ({ children }) => {
  const { role } = useSelector((store) => store.auth); // Recupera el rol del usuario desde el estado de Redux
  if (role === "admin") return children; // Si el usuario es un administrador, renderiza los componentes hijos
  return null;
};

export default AdminRoute;
