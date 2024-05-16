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

  // Local states
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const description = `Payment of ${formatPrice(totalAmount)} from ${email}`;

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("https://ecom-stripe-server.onrender.com/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            userEmail: email,
            shippingAddress,
            billingAddress,
            description,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setClientSecret(data.clientSecret);
          setLoading(false);
        } else {
          throw new Error(data.message || "Failed to create payment intent");
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [cartItems, email, shippingAddress, billingAddress, description]);

  return (
    <main>
      {loading && <Loader />}
      {error && <div className="error">{error}</div>}
      <div>
        {clientSecret && <CheckoutForm clientSecret={clientSecret} />}
      </div>
    </main>
  );
};

export default Checkout;
