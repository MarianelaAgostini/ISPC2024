import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

import ChangeOrderStatus from "../changeOrderStatus/ChangeOrderStatus";
// import Steps from "../steps/Steps";
import { OrderTable, Steps } from "../../components";
import { useTranslation } from 'react-i18next';

const OrderDetailsComponent = ({ order, admin, user, orderId }) => {
   const { t } = useTranslation();
   return (
      <>
         <section className="p-4 w-full bg-primary-content flex items-center">
            <article className="w-full flex flex-col lg:flex-row items-center justify-between gap-y-5">
               {/* Order Details */}
               <div className="w-full mx-auto md:px-6 ">
                  <section>
                     <h1 className="text-xl md:text-3xl font-bold text-secondary-content">
                        {t('Detalles del pedido')}
                     </h1>
                     <p className="font-semibold text-lg my-2">
                        {t('ID de orden')} :<span className="font-light text-gray-500"> {order.id}</span>
                     </p>
                     <p className="font-semibold text-lg my-2">
                        {t('Importe del pedido')} :
                        <span className="font-light text-gray-500">
                           {formatPrice(order.orderAmount)}
                        </span>
                     </p>
                     <p className="font-semibold text-lg my-2">
                        {t('Estado del pedido')} :
                        <span
                           className={`font-bold ${
                              order.orderStatus === t('Objeto(s) Entregados')
                                 ? "text-green-600"
                                 : "text-primary"
                           }`}
                        >
                           {order.orderStatus}
                        </span>
                     </p>
                  </section>
                  {/* Steps for order traacking only for user */}
                  {user && <Steps order={order} />}
                  {admin && (
                     <div>
                        {/* Recipient Name */}
                        <p className="font-semibold text-lg">
                           {t('Nombre del destinatario')}:
                           <span className="font-light">{order.shippingAddress.name}</span>
                        </p>
                        {/* Phone Number */}
                        <p className="font-semibold text-lg">
                           {t('Teléfono')} :<span className="font-light">{order.shippingAddress.phone}</span>
                        </p>
                        {/* Address */}
                        <p className="font-semibold text-lg">
                           {t('Dirección de envío')} :
                           <span className="font-light">
                              {order.shippingAddress.line1}, {order.shippingAddress.line2},
                              {order.shippingAddress.city},{order.shippingAddress.country}
                           </span>
                        </p>
                     </div>
                  )}
               </div>
               {/* Update order Status */}
               {admin && <ChangeOrderStatus order={order} orderId={orderId} />}
            </article>
         </section>
         <main className="py-5">
            <div className="pb-5">
               {admin ? (
                  <Link to="/admin/orders" className="link active my-2">
                     &larr; {t('Volver a Todos los Pedidos')}
                  </Link>
               ) : (
                  <Link to="/my-orders" className="link active my-2">
                     &larr; {t('Volver a Todos los Pedidos')}
                  </Link>
               )}
            </div>

            <OrderTable order={order} user={user} />
         </main>
      </>
   );
};

export default OrderDetailsComponent;
