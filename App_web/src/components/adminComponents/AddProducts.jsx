import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { categories } from "../../utils/adminProductCategories";
import { defaultValues } from "../../utils/adminAddProductDefaultValues";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, Timestamp, setDoc, doc } from "firebase/firestore";
import { storage, db } from "../../firebase/config";
import { useSelector } from "react-redux";

//Esperar cambios en el input (handle event)
const AddProducts = () => {
  const navigate = useNavigate();
  const { id: paramsId } = useParams();
  const { products: reduxProducts } = useSelector((store) => store.product);
  const productEdit = reduxProducts.find((item) => item.id === paramsId);
  const [product, setProduct] = useState(() => {
    return detectForm(paramsId, defaultValues, productEdit);
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  //Buscar para añadir o modificar
  function detectForm(paramsId, func1, func2) {
    if (paramsId === "ADD") return func1;
    return func2;
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  }
  // Subir archivo (imagen) a Firestore
  function handleImageChange(e) {
    const file = e.target.files[0];
    const storageRef = ref(storage, `images/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        toast.error(error.code, error.message);
      },
      () => {
        // Esperar y avisar cuando se completa la carga de archivo
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProduct({ ...product, imageURL: downloadURL });
          toast.success("Archivo subido con éxito");
        });
      }
    );
  }
  // Añadir producto a Firebase
  async function addProduct(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, "products"), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        description: product.description,
        createdAt: Timestamp.now().toDate(),
      });
      setUploadProgress(0);
      setProduct(defaultValues);
      setIsLoading(false);
      toast.success("Producto añadido a la base de datos");
      navigate("/admin/all-products");
    } catch (error) {
      console.log(error.message);
      toast.error("Algo salió mal");
      setIsLoading(false);
    }
  }
  //Editar producto
  async function editProduct(e) {
    e.preventDefault();
    setIsLoading(true);
    // Verificar si la imagen fue actualizada
    if (product.imageURL !== productEdit.imageURL) {
      // Borrar imagen de la bd
      const storageRef = ref(storage, productEdit.imageURL);
      await deleteObject(storageRef);
    }
    try {
      await setDoc(doc(db, "products", paramsId), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        description: product.description,
        // Datos de guardado
        createdAt: productEdit.createdAt,
        editedAt: Timestamp.now().toDate(),
      });
      setUploadProgress(0);
      setProduct(defaultValues);
      setIsLoading(false);
      toast.success("Producto actualizado correctamente");
      navigate("/admin/all-products");
    } catch (error) {
      console.log(error.message);
      toast.error("Algo salió mal");
      setIsLoading(false);
    }
  }

  // Deshabilitar botón hasta que se carguen los campos
  const AllFieldsRequired =
    Boolean(product.brand) &&
    Boolean(product.category) &&
    Boolean(product.description) &&
    Boolean(product.imageURL) &&
    Boolean(product.name) &&
    Boolean(product.name);

  return (
    <>
      {isLoading && <Loader />}

      <main className="h-full border-r-2 p-1">
        <h1 className="text-xl md:text-3xl font-semibold pb-3">
          {detectForm(paramsId, "Add New Product", "Edit Product")}
        </h1>
        <form className="form-control" onSubmit={detectForm(paramsId, addProduct, editProduct)}>
          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">Nombre del producto:</label>
            <input
              className="input input-bordered max-w-lg w-full border-2"
              type="text"
              placeholder="Product Name"
              required
              name="name"
              value={product.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">Precio del producto: </label>
            <input
              className="input input-bordered max-w-lg w-full border-2"
              type="number"
              placeholder="Product Price"
              required
              name="price"
              value={product.price}
              onChange={handleInputChange}
            />
          </div>
          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">Categoría del producto:</label>
            <select
              className="select select-bordered w-full max-w-lg"
              required
              name="category"
              value={product.category}
              onChange={handleInputChange}
            >
              <option disabled value="">
                -- Elegir categoría --
              </option>
              {categories.map((c) => {
                return (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">Marca del producto: </label>
            <input
              className="input input-bordered max-w-lg w-full border-2"
              type="text"
              placeholder="Product Brand"
              required
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
            />
          </div>
          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">Descripcion del producto: </label>
            <textarea
              className="textarea textarea-bordered h-32 max-w-lg w-full"
              type="text"
              placeholder="Product Description"
              required
              name="description"
              value={product.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label className="label-text font-bold mb-2 block text-lg">Imagen del producto: </label>
            <div className="border-2 rounded-sm  max-w-xl w-full px-4 pb-2">
              <div>
                <progress
                  className="progress progress-primary w-44 md:w-72 xl:w-full"
                  value={uploadProgress}
                  max="100"
                ></progress>
              </div>
              <input
                className="max-w-lg w-full"
                accept="image/all"
                type="file"
                placeholder="IMAGE URL"
                name="image"
                onChange={handleImageChange}
              />
              {product.imageURL === "" ? null : (
                <input
                  className="input input-sm input-bordered max-w-lg w-full my-2"
                  type="text"
                  value={product.imageURL}
                  required
                  placeholder="Image URL"
                  disabled
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary text-lg max-w-[200px]  mt-2"
            disabled={!AllFieldsRequired}
          >
            {detectForm(paramsId, "Add Product", "Update Product")}
          </button>
        </form>
      </main>
    </>
  );
};

export default AddProducts;
