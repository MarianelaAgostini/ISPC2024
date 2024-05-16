import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { categories } from "../../utils/adminProductCategories";
import { defaultValues } from "../../utils/adminAddProductDefaultValues";
import { collection, addDoc, Timestamp, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import useDarkMode from "../../hooks/useDarkMode";

const AddProducts = () => {
  const navigate = useNavigate();
  const { id: paramsId } = useParams();
  const { products: reduxProducts } = useSelector((store) => store.product);
  const productEdit = reduxProducts.find((item) => item.id === paramsId);
  const darkMode = useDarkMode();
  const [product, setProduct] = useState(() => {
    return detectForm(paramsId, defaultValues, productEdit);
  });
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const allFieldsRequired = checkAllFieldsRequired(product);
    setIsButtonDisabled(!allFieldsRequired);
  }, [product]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  function detectForm(paramsId, func1, func2) {
    if (paramsId === "ADD") return func1;
    return func2;
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  }

  async function addProduct(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        ...product,
        price: Number(product.price),
        createdAt: Timestamp.now().toDate(),
      });
      setProduct(defaultValues);
      setIsLoading(false);
      toast.success(t('Producto añadido a la base de datos'));
      navigate("/admin/all-products");
    } catch (error) {
      setIsLoading(false);
    }
  }

  async function editProduct(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await setDoc(doc(db, "products", paramsId), {
        ...product,
        price: Number(product.price),
        editedAt: Timestamp.now().toDate(),
      });
      setIsLoading(false);
      toast.success(t('Producto actualizado correctamente'));
      navigate("/admin/all-products");
    } catch (error) {
      setIsLoading(false);
    }
  }

  function checkAllFieldsRequired(product) {
    return (
      product.brand &&
      product.category &&
      product.description &&
      product.imageURL &&
      product.name &&
      product.price
    );
  }

  return (
    <>
      {isLoading && <Loader />}

      <main className="h-full border-r-2 p-1">
        <h3 className={`text-xl md:text-3xl font-semibold pb-3 bg-${darkMode ? 'dark' : 'neutral'}`}>
          {detectForm(paramsId, (t('Añadir producto')), (t('Editar producto')))}
        </h3>
        <form className="form-control" onSubmit={detectForm(paramsId, addProduct, editProduct)}>
          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">{t('Nombre del producto')}:</label>
            <input
              className="input input-bordered max-w-lg w-full border-2"
              type="text"
              placeholder={t('Nombre del producto')}
              required
              name="name"
              value={product.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">{t('Precio del producto')}: </label>
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
            <label className="label-text font-bold mb-2 block text-lg">{t('Categoría del producto')}:</label>
            <select
              className="select select-bordered w-full max-w-lg"
              required
              name="category"
              value={product.category}
              onChange={handleInputChange}
            >
              <option disabled value="">
                -- {t('Elegir categoría')} --
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
            <label className="label-text font-bold mb-2 block text-lg">{t('Marca del producto')}: </label>
            <input
              className="input input-bordered max-w-lg w-full border-2"
              type="text"
              placeholder={t('Marca del producto')}
              required
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
            />
          </div>
          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">{t('Descripcion del producto')}: </label>
            <textarea
              className="textarea textarea-bordered h-32 max-w-lg w-full"
              type="text"
              placeholder={t('Descripcion del producto')}
              required
              name="description"
              value={product.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label className="label-text font-bold mb-2 block text-lg">{t('Imagen del producto')}: </label>
            <div className="flex items-center border-2 rounded-sm  max-w-xl w-full px-4 pb-2">
              <input
                className="max-w-lg w-full flex items-center"
                type="text"
                placeholder="URL de la imagen"
                name="imageURL"
                value={product.imageURL}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button
              type="submit"
              className="btn btn-primary text-base max-w-[200px] overflow-hidden mt-2"
              disabled={isButtonDisabled}
          >
              {detectForm(paramsId, t('Añadir producto'), t('Actualizar producto'))}
          </button>
        </form>
      </main>
    </>
  );
};

export default AddProducts;
