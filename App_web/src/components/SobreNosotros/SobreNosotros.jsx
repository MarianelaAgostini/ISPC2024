import React, { useRef, useState } from "react";
import coctelisLogo from "../../assets/coctelis-logo.png"
import { useTranslation } from 'react-i18next';
import useDarkMode from "../../hooks/useDarkMode";

let currentIndex = 0;
const SobreNosotros = () => {
   const { t } = useTranslation();
   const darkMode = useDarkMode();

   return (
      <div className={`black h-screen bg-${darkMode ? 'dark' : 'neutral'}`}>
         <div className="container px-6 py-16 mx-auto h-full">
            <div className="flex items-center justify-center h-full">
               <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full h-full">
                  <div className="w-full lg:w-1/2 lg:max-w-lg">
                     <h2 className={`text-4xl font-bold text-neutral lg:text-4xl bg-${darkMode ? 'dark' : 'neutral'}`}>
                        {t('Sobre nosotros')}
                     </h2>
                     <h2 className={`mt-3 text-gray-600 bg-${darkMode ? 'dark' : 'neutral'}`}>
                        {t('Somos una empresa de desarrollo de software.')} <br /> <br />
                        {t('Nuestro equipo de trabajo se encuentra en constante actualización y formación para brindar un servicio de calidad a nuestros clientes.')} <br /> <br />
                        {t('Nuestro objetivo es mantener una relación activa con el cliente y que se extienda a través de los años. De nuestra parte nos comprometemos a realizar nuestro trabajo con compromiso y dedicación para que estén satisfechos con el servicio contratado.')}
                     </h2>
                  </div>
                  <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
                     <img
                        className="w-50vw h-50vh lg:max-w-3xl"
                        src={coctelisLogo}
                        alt="coctelis-logo"
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default SobreNosotros;
