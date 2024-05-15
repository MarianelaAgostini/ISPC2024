import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

const AdminRoute = ({ children }) => {
  const { role } = useSelector((store) => store.auth);
  const { t } = useTranslation();
  if (role === "admin") return children;
  return (
    <section className="flex flex-col items-center justify-center w-full page gap-5">
      <h2 className="text-4xl font-bold">{t('Permisos denegados')}</h2>
      <p className="text-xl">{t('Esta página solo puede ser vista por un administrador')}.</p>
      <Link to="/" className="btn btn-error btn-outline btn-lg">
        ← {t('Volver a inicio')}
      </Link>
    </section>
  );
};

export const AdminOnlyLink = ({ children }) => {
  const { role } = useSelector((store) => store.auth); 
  if (role === "admin") return children;
  return null;
};

export default AdminRoute;
