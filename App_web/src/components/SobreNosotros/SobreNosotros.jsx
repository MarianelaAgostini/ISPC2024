import React, { useRef, useState } from "react";
import { Header } from "../../components";
import coctelisLogo from "../../assets/coctelis-logo.png"

let currentIndex = 0;
const SobreNosotros = () => {
   

   return (
      <>
         <main className="bg-base-100 w-full md:w-9/12 min-h-[92vh] mx-auto flex flex-col items-start justify-center ">
            <div className="container px-6 py-16 mx-auto">
               <div className="items-center lg:flex">
                  <div className="w-full lg:w-1/2">
                     <div className="lg:max-w-lg">
                        <p className="text-4xl font-bold text-neutral lg:text-4xl">
                           Sobre nosotros
                           
                        </p>

                        <p className="mt-3 text-gray-600 dark:text-gray-400">
                           Somos una empresa de desarrollo de software. <br /> <br />
                           Nuestro equipo de trabajo se encuentra en cosntante actualización y formación
                           para brindar un servicio de calidad a nuestros clientes. <br /> <br />
                           Nuestro objetivo es mantener una relación activa con el cliente y que se extienda a través de los años.
                           De nuestra parte nos comprometemos a realizar nuestro trabajo con compromiso y dedicación
                           para que estén satisfechos con el servicio contratado.
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
                     <img
                        className="w-full h-full lg:max-w-3xl"
                        src= {coctelisLogo}
                        alt="coctelis-logo"
                     />
                  </div>
               </div>
            </div>
         </main>
      </>
   );
};

export default SobreNosotros;
