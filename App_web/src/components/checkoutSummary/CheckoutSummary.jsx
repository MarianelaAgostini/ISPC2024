import React from "react";
import { useSelector } from "react-redux";
import { formatPrice } from "../../utils/formatPrice";

const CheckoutSummary = () => {
   const { cartItems, totalQuantity, totalAmount } = useSelector(
      (store) => store.cart
   );
   return (
      <>
         <h1 className="text-3xl font-light">Resumen del pago</h1>
         <div className="mt-2">
            <p className="text-sm font-light text-gray-500">
               Obeto(s) del carro: {totalQuantity}{" "}
            </p>
            <div className="flex items-center justify-between">
               <h1 className="text-xl font-light">Subtotal: </h1>
               <p className="text-primary text-xl font-semibold">
                  {formatPrice(totalAmount)}
               </p>
            </div>
            {cartItems.map((item) => {
               const { id, name, price, qty } = item;
               return (
                  <section
                     className="border-2 border-secondary-content rounded-md my-2 p-2"
                     key={id}
                  >
                     <h1 className="text-lg md:text-2xl text-primary">
                        {name}
                     </h1>
                     <p>Cantidad: {qty}</p>
                     <p>Precio unitario : {formatPrice(price)}</p>
                     <p>Precio total: {formatPrice(price * qty)}</p>
                  </section>
               );
            })}
         </div>
      </>
   );
};

export default CheckoutSummary;
