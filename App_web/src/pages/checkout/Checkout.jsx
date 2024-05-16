import React, { useState, useEffect } from "react";
import Loader from "../../components/loader/Loader";
import { CheckoutForm } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { calculateSubtotal, calculateTotalQuantity } from "../../redux/slice/cartSlice";
import { formatPrice } from "../../utils/formatPrice";

const Checkout = () => {
  // Redux states
  const { cartItems, totalQuantity, totalAmount } = useSelector((store) => store.cart);
  const { shippingAddress, billingAddress } = useSelector((store) => store.checkout);
  const { email } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(calculateSubtotal());
    dispatch(calculateTotalQuantity());
  }, [dispatch, cartItems]);

  // local States
  const [clientSecret, setClientSecret] = useState("");

  const description = `Payment of ${formatPrice(totalAmount)} from ${email}`;
  useEffect(() => {
    fetch("https://ecom-stripe-server.onrender.com/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartItems,
        userEmail: email,
        shippingAddress,
        billingAddress,
        description,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  return (
    <main>
      {!clientSecret && <Loader />}
      <div>
        {clientSecret && <CheckoutForm />}
      </div>
    </main>
  );
};

export default Checkout;
