import React, { useRef, useState } from "react";
import { Header } from "../../components";
import { AiOutlineFacebook, AiOutlineInstagram, AiOutlineMail } from "react-icons/ai";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Contact = () => {
   const formRef = useRef();
   const [loading, setLoading] = useState(true);
   const { t } = useTranslation();

   const sendEmail = (e) => {
      e.preventDefault();
      setLoading(true);
      emailjs
         .sendForm(
            "service_rn5uwdh",
            "template_z55djla",
            formRef.current,
            "onCf_FZuuuG_27Kb_"
         )
         .then(
            (result) => {
               console.log(result.text);
               toast.success(t('Comentarios registrados. Nos pondremos en contacto contigo en breve.'));
            },
            (error) => {
               console.log(error.text);
               toast.error(t('Algo salió mal, por favor intenta nuevamente más tarde.'));
            }
         );
      setLoading(false);
      e.target.reset(); // clear input fields
   };

   return (
      <>
         <main className="w-full mx-auto px-2 lg:w-9/12 md:px-6 mt-4 lg:mt-6 flex flex-col md:flex-row justify-between gap-10">
            <section className="w-full md:w-[30rem] bg-primary rounded-md p-6 h-72">
               {/* Card */}
               <div className="mb-10">
                  <h1 className="text-white md:text-3xl mb-2">
                     {t('Información de contacto')}
                  </h1>
                  <p className="md:text-white">
                     {t('Rellena el formulario o contacta con nosotros por otros medios')}
                  </p>
               </div>
               <div>
                  <div className="flex items-center gap-2 my-2 md:text-white">
                     <AiOutlineMail />
                     <a href="mailto: coctelis@gmail.com?subject=Feedback&body=message">
                        coctelis@gmail.com
                     </a>
                  </div>
                  <div className="flex items-center gap-2 md:text-white  my-2">
                     <AiOutlineFacebook />
                     <a
                        href="https://facebook.com"
                        rel="noreferrer"
                        target="_blank"
                     >
                        @Coctelis
                     </a>
                  </div>
                  <div className="flex items-center gap-2 md:text-white my-2">
                     <AiOutlineInstagram />
                     <a
                        href="https://Instagram.com/Coctelis"
                        rel="noreferrer"
                        target="_blank"
                     >
                        @Coctelis
                     </a>
                  </div>
               </div>
            </section>
            <section className="w-full md:w-2/3 rounded-md shadow-lg border-2 p-6">
               {/* Form */}
               <h1 className="text-xl md:text-3xl">{t('Contáctanos')}</h1>
               <form
                  className="form-control"
                  onSubmit={sendEmail}
                  ref={formRef}
               >
                  <div className="py-2">
                     <label className="label-text md:font-semibold mb-2 block text-lg">
                        {t('Nombre y apellido')} :
                     </label>
                     <input
                        className="input input-bordered max-w-lg w-full border-2"
                        type="text"
                        placeholder={t('Nombre y apellido')}
                        required
                        name="username"
                     />
                  </div>
                  <div className="py-2">
                     <label className="label-text md:font-semibold mb-2 block text-lg">
                        {t('Email')} :
                     </label>
                     <input
                        className="input input-bordered max-w-lg w-full border-2"
                        type="email"
                        placeholder={t('Email')}
                        required
                        name="email"
                     />
                  </div>
                  <div className="py-2">
                     <label className="label-text md:font-semibold mb-2 block text-lg">
                        {t('Asunto')} :
                     </label>
                     <input
                        className="input input-bordered max-w-lg w-full border-2"
                        type="text"
                        placeholder={t('Asunto')}
                        required
                        name="subject"
                     />
                  </div>
                  <div className="py-2">
                     <label className="label-text md:font-semibold mb-2 block text-lg">
                        {t('Mensaje')} :
                     </label>
                     <textarea
                        className="textarea textarea-bordered max-w-[100%] w-full"
                        rows={5}
                        placeholder={t('Mensaje')}
                        required
                        name="message"
                     ></textarea>
                  </div>
                  <button className="m-auto link modal-button btn neutral md:w-auto mb-4 md:mb-0 max-w-xs w-full" type="submit">
                     {t('Enviar mensaje')}
                  </button>
               </form>
            </section>
         </main>
      </>
   );
};

export default Contact;
