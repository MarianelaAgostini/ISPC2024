import React, { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CheckoutSummary from "../checkoutSummary/CheckoutSummary";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import Header from "../header/Header";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// firebase
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
//redux
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slice/cartSlice";
import Loader from "../loader/Loader";

import verifiedIcon from "../../assets/verificado1.gif"; // Importar la imagen
import { useTranslation } from 'react-i18next';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, userId } = useSelector((store) => store.auth);
  const { cartItems, totalAmount } = useSelector((store) => store.cart);
  const { shippingAddress } = useSelector((store) => store.checkout);
  const { t } = useTranslation();

  const saveOrder = () => {
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
      createdAt: Timestamp.now().toDate(),
    };
    try {
      addDoc(collection(db, "orders"), orderDetails);
      dispatch(clearCart());
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const confirmPayment = await stripe
      .confirmPayment({
        elements,
        confirmParams: {
          
          return_url: "http://localhost:5173/checkout-success",
        },
        redirect: "if_required",
      })
      .then((res) => {
        if (res.error) {
          setMessage(res.error.message);
          toast.error(res.error.message);
          return;
        }
        if (res.paymentIntent) {
          if (res.paymentIntent.status === t('Completado')) {
            setIsLoading(false);
            toast.success(t('Pago exitoso'));
            saveOrder();
            navigate("/checkout-success", { replace: true });
          }
        }
      });
    setIsLoading(false);
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) {
      return;
    }
  }, [stripe]);

  return (
    <>
     
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
        
      </section>
    </>
  );
};

export default CheckoutForm;
