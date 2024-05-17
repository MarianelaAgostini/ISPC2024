import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../../components";
import { formatPrice } from "../../utils/formatPrice";
import { BiTrash } from "react-icons/bi";
import emptyCart from "../../assets/empty-cart.png";
import mastercardIcon from "../../assets/mastercard-icon.png";
import visaIcon from "../../assets/visa-icon.png";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseCart,
  removeCartItem,
  clearCart,
  calculateSubtotal,
  calculateTotalQuantity,
} from "../../redux/slice/cartSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslation } from 'react-i18next';

const Cart = () => {
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { t } = useTranslation();

  const { cartItems, totalAmount, totalQuantity } = useSelector(
    (store) => store.cart
  );
  const { isUserLoggedIn } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const increaseQty = (item) => {
    dispatch(addToCart(item));
  };

  const decreaseQty = (item) => {
    dispatch(decreaseCart(item));
  };

  const removeItem = (item) => {
    dispatch(removeCartItem(item));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { cardholderName, cardNumber, expiryDate, securityCode } = formData;
    if (cardholderName && cardNumber && expiryDate && securityCode) {
      setShowSuccessMessage(true);

      // Aquí se haría el envío de los datos del formulario y los artículos del carrito a la base de datos
      const orderData = {
        cardholderName,
        cardNumber,
        expiryDate,
        securityCode,
        items: cartItems,
      };

      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Order saved:', data);
        // Limpiar los campos del formulario y el carrito si se guarda con éxito
        setFormData({
          cardholderName: "",
          cardNumber: "",
          expiryDate: "",
          securityCode: "",
        });
        dispatch(clearCart());
      })
      .catch(error => {
        console.error('Error saving order:', error);
      });

    } else {
      alert(t('Por favor complete todos los campos obligatorios'));
    }
  };

  const handleLinkClick = () => {
    handleSubmit({
      preventDefault: () => {},
    });
  };

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <section className="w-full mx-auto p-4 md:p-10 lg:w-9/12 md:px-6 flex flex-col h-full">
        {!cartItems.length ? (
          <div className="w-full mx-auto h-max flex flex-col items-center justify-center ">
            <img src={emptyCart} alt="empty-Cart" />
            <h1 className="mt-4 text-xl">
              {t('Parece que no has agregado nada a tu carrito')}{" "}
            </h1>
            <br />
            <Link to="/all" className="link link-primary">
              {t('Haz clic aquí para explorar más')}
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-semibold mb-4">{t('Carrito de compras')}</h1>
            <article className="flex flex-col xl:flex-row justify-between gap-y-10 gap-x-5">
              <div className="overflow-x-auto w-full flex-1">
                <table className="table table-zebra w-full ">
                  <thead>
                    <tr>
                      <th className="text-sm md:text-lg">{t('Objeto')}</th>
                      <th className="text-sm md:text-lg">{t('Acciones')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => {
                      const { imageURL, name, price, qty, id } = item;
                      return (
                        <tr key={index}>
                          <td className="flex gap-x-2 ">
                            <Link
                              to={`/product-details/${id}`}
                              className="flex items-center"
                            >
                              <LazyLoadImage
                                src={
                                  imageURL ||
                                  `https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png`
                                }
                                alt={name}
                                className="w-24 object-fill"
                                placeholderSrc="https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"
                                effect="blur"
                              />
                            </Link>
                            <div>
                              <Link to={`/product-details/${id}`}>
                                <h3 className=" md:text-lg">{name}</h3>
                              </Link>
                              <p className="font-light md:text-lg">
                                {formatPrice(price)}
                              </p>
                              <p>{t('Cantidad')}: </p>
                              <div className="btn-group items-center mb-2">
                                <button
                                  className="btn btn-xs btn-outline"
                                  onClick={() => decreaseQty(item)}
                                >
                                  -
                                </button>
                                <button className="btn btn-xs btn-ghost disabled">
                                  {qty}
                                </button>
                                <button
                                  className="btn btn-xs btn-outline"
                                  onClick={() => increaseQty(item)}
                                >
                                  +
                                </button>
                              </div>
                              <p className="font-light">
                                {t('Total')}:
                                <span className=" text-lg text-primary">
                                  {formatPrice(price * qty)}
                                </span>
                              </p>
                            </div>
                          </td>
                          <td>
                            <BiTrash
                              size={24}
                              color="red"
                              onClick={() => removeItem(item)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="w-88 md:w-96 h-56 shadow-lg rounded-sm p-2 flex flex-col gap-3 ">
                <Link to="/all" className="link italic text-gray-400">
                  &larr; {t('Continuar comprando')}
                </Link>
                <h1>
                  {t('Artículos en el carrito')}:{" "}
                  <span className="font-light">{totalQuantity}</span>{" "}
                </h1>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t('Subtotal')}</h2>
                  <h1 className="text-primary text-2xl">
                    {formatPrice(totalAmount)}
                  </h1>
                </div>
                <p className="text-gray-400">
                  {t('Impuestos y envío calculados en el checkout')}
                </p>

                <div className="w-88 md:w-96 h-max shadow-lg rounded-sm p-4 flex flex-col gap-4 bg-white">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold">{t('Pagar con tarjeta')}</h2>
                    <div className="flex items-center gap-2">
                      <img src={mastercardIcon} alt="Mastercard" />
                      <img src={visaIcon} alt="Visa" />
                    </div>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleChange}
                      placeholder={t('Nombre del titular')}
                      className="border border-gray-300 rounded-md p-2"
                      maxLength={100}
                      pattern="[A-Za-z\s]+"
                      title={t('Ingrese solo letras y espacios')}
                      required
                    />
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder={t('Número de tarjeta')}
                      className="border border-gray-300 rounded-md p-2"
                      maxLength={16}
                      pattern="\d{16}"
                      title={t('Ingrese 16 números')}
                      required
                    />
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (value.length === 2 && formData.expiryDate.length === 1) {
                          value += '/';
                        }
                        setFormData({ ...formData, expiryDate: value });
                      }}
                      placeholder={t('Fecha de vencimiento MM/AA')}
                      className="border border-gray-300 rounded-md p-2"
                      maxLength={5}
                      pattern="(0[1-9]|1[0-2])\/?[0-9]{2}"
                      title={t('Ingrese MM/AA')}
                      required
                    />

                    <input
                      type="text"
                      name="securityCode"
                      value={formData.securityCode}
                      onChange={handleChange}
                      placeholder={t('Código de seguridad (CVC)')}
                      className="border border-gray-300 rounded-md p-2"
                      maxLength={3}
                      pattern="\d{3}"
                      title={t('Ingrese 3 números')}
                      required
                    />
                    {isUserLoggedIn ? (
                      <button type="submit" className="btn btn-primary w-full">
                        {t('Pagar')}
                      </button>
                    ) : (
                      <button disabled className="btn btn-primary w-full">
                        {t('Inicia sesión para pagar')}
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </article>
          </div>
        )}

        {showSuccessMessage && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-8 rounded-md text-center">
              <h2 className="text-xl font-semibold mb-4">{t('Pago con éxito!')}</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowSuccessMessage(false)}
              >
                <Link to="/checkout-details" className="btn btn-primary w-full" > OK</Link>
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Cart;
