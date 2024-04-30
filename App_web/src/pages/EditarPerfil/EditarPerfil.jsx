import React, { useRef, useState } from "react";
import { Header } from "../../components";
import { AiOutlineMail, AiOutlineFacebook, AiOutlineInstagram } from "react-icons/ai";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const EditarPerfil = () => {
   const formRef = useRef();
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
      nombre: "",
      apellido: "",
      ciudad: "",
      telefono: ""
   });
   const [showModal, setShowModal] = useState(false);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

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
               toast.success("Perfil actualizado exitosamente");
               setShowModal(true);
            },
            (error) => {
               console.log(error.text);
               toast.error("Hubo un problema al actualizar el perfil, inténtalo de nuevo más tarde");
            }
         )
         .finally(() => setLoading(false));
   };

   const closeModal = () => {
      setShowModal(false);
      setFormData({
         nombre: "",
         apellido: "",
         ciudad: "",
         telefono: ""
      });
   };

   return (
      <>
         <Header text="Editar Perfil" />
         <main className="w-full mx-auto px-2 lg:w-9/12 md:px-6 mt-4 lg:mt-6 flex flex-col md:flex-row justify-between gap-10">
            
            <section className="w-full md:w-2/3 rounded-md shadow-lg border-2 p-6">
               {/* Form */}
               <h1 className="text-xl md:text-3xl">Editar Perfil</h1>
               <form
                  className="form-control"
                  onSubmit={sendEmail}
                  ref={formRef}
               >
                  <div className="py-2">
                     <label className="label-text md:font-semibold mb-2 block text-lg">
                        Nombre:
                     </label>
                     <input
                        className="input input-bordered max-w-lg w-full border-2"
                        type="text"
                        placeholder="Nombre"
                        required
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                     />
                  </div>
                  <div className="py-2">
                     <label className="label-text md:font-semibold mb-2 block text-lg">
                        Apellido:
                     </label>
                     <input
                        className="input input-bordered max-w-lg w-full border-2"
                        type="text"
                        placeholder="Apellido"
                        required
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                     />
                  </div>
                  <div className="py-2">
                     <label className="label-text md:font-semibold mb-2 block text-lg">
                        Ciudad:
                     </label>
                     <input
                        className="input input-bordered max-w-lg w-full border-2"
                        type="text"
                        placeholder="Ciudad"
                        required
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                     />
                  </div>
                  <div className="py-2">
                     <label className="label-text md:font-semibold mb-2 block text-lg">
                        Teléfono:
                     </label>
                     <input
                        className="input input-bordered max-w-lg w-full border-2"
                        type="text"
                        placeholder="Teléfono"
                        required
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                     />
                  </div>
                  <button className="btn max-w-xs w-full" type="submit" disabled={loading}>
                     {loading ? "Enviando..." : "Guardar Cambios"}
                  </button>
               </form>
            </section>
         </main>
         {/* Modal */}
         {showModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
               <div className="bg-white p-8 rounded-md shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Perfil Actualizado</h2>
                  <p>Nombre: {formData.nombre}</p>
                  <p>Apellido: {formData.apellido}</p>
                  <p>Ciudad: {formData.ciudad}</p>
                  <p>Teléfono: {formData.telefono}</p>
                  <button className="btn mt-4" onClick={closeModal}>Cerrar</button>
               </div>
            </div>
         )}
      </>
   );
};

export default EditarPerfil;
