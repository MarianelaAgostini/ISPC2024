import React, { useState } from "react";
import CheckoutSummary from "../checkoutSummary/CheckoutSummary";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slice/cartSlice";
import Loader from "../loader/Loader";
import verifiedIcon from "../../assets/verificado1.gif";
import { useTranslation } from 'react-i18next';

const CheckoutForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, userId } = useSelector((store) => store.auth);
  const { cartItems, totalAmount } = useSelector((store) => store.cart);
  const { shippingAddress } = useSelector((store) => store.checkout);
  const { t } = useTranslation();

  const saveOrder = async () => {
    const date = new Date().toDateString();
    const time = new Date().toLocaleTimeString();
    const orderDetails = {
      userId,
      email,
      orderDate: date,
      orderTime: time,
      orderAmount: totalAmount,
      orderStatus: t('Orden realizada'),
      cartItems,
      shippingAddress,
      createdAt: Timestamp.now(),
    };
    try {
      await addDoc(collection(db, "orders"), orderDetails);
      dispatch(clearCart());
      toast.success(t('Orden guardada correctamente'));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await saveOrder();
      setIsLoading(false);
      navigate("/checkout-success", { replace: true });
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className="w-full mx-auto p-4 md:p-10 md:w-9/12 md:px-6 flex flex-col h-full">
        <div className="flex flex-col-reverse md:flex-row gap-4 justify-evenly">
          <div className="w-full md:w-2/5 h-max p-4 bg-base-100 rounded-md shadow-xl">
            <CheckoutSummary />
          </div>
          <div className="text-center mt-8">
            <div>
              <img src={verifiedIcon} alt="Verified" />
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <button type="submit" className="btn btn-primary mt-4">
            {t('Confirmar Pedido')}
          </button>
        </form>
      </section>
    </>
  );
};

export default CheckoutForm;
