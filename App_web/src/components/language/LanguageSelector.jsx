import React, { useState } from "react";
import i18n from "i18next";
import { useTranslation } from 'react-i18next';

const LanguageButton = ({ languageCode, onClick }) => {
  
  return (
    <button className="btn btn-ghost" onClick={() => onClick(languageCode)}>
      {languageCode.toUpperCase()}
    </button>
  );
};

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const { t } = useTranslation();

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
  };
  

  return (
    <div className="flex items-center gap-x-2">
      <LanguageButton languageCode="en" onClick={handleLanguageChange} />
      <LanguageButton languageCode="es" onClick={handleLanguageChange} />
      <LanguageButton languageCode="ru" onClick={handleLanguageChange} />
    </div>
  );
};

export default LanguageSelector;
