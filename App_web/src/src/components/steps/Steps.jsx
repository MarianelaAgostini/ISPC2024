import React from "react";
import { useTranslation } from 'react-i18next';

const Steps = ({ order }) => {
  const { t } = useTranslation();
  return (
    <>
      {order.orderStatus === "Order Placed" && (
        <ul className="steps steps-vertical lg:steps-horizontal ">
          <li data-content="●" className="step step-primary">
            <pre> {t('Orden realizada')} </pre>
          </li>
          <li data-content="●" className="step ">
            <pre> {t('Procesando')} </pre>
          </li>
          <li data-content="●" className="step">
            <pre> {t('Pedido enviado')} </pre>
          </li>
          <li data-content="✓" className="step">
            <pre> {t('Pedido entregado')} </pre>
          </li>
        </ul>
      )}
      {order.orderStatus === "Processing..." && (
        <ul className="steps steps-vertical lg:steps-horizontal">
          <li data-content="●" className="step step-primary">
            <pre> {t('Orden realizada')} </pre>
          </li>
          <li data-content="●" className="step step-primary">
            <pre> {t('Procesando')} </pre>
          </li>
          <li data-content="●" className="step">
            <pre> {t('Pedido enviado')} </pre>
          </li>
          <li data-content="✓" className="step">
            <pre> {t('Pedido entregado')} </pre>
          </li>
        </ul>
      )}
      {order.orderStatus === "Item(s) Shipped" && (
        <ul className="steps steps-vertical lg:steps-horizontal">
          <li data-content="●" className="step step-primary">
            <pre> {t('Orden realizada')} </pre>
          </li>
          <li data-content="●" className="step step-primary">
            <pre> {t('Procesando')} </pre>
          </li>
          <li data-content="●" className="step step-primary">
            <pre> {t('Pedido enviado')} </pre>
          </li>
          <li data-content="✓" className="step">
            <pre> {t('Pedido entregado')} </pre>
          </li>
        </ul>
      )}
      {order.orderStatus === "Item(s) Delivered" && (
        <ul className="steps steps-vertical lg:steps-horizontal">
          <li data-content="●" className="step step-primary">
            <pre> {t('Orden realizada')} </pre>
          </li>
          <li data-content="●" className="step step-primary">
            <pre> {t('Procesando')} </pre>
          </li>
          <li data-content="●" className="step step-primary">
            <pre> {t('Pedido enviado')} </pre>
          </li>
          <li data-content="✓" className="step step-primary">
            <pre> {t('Pedido entregado')} </pre>
          </li>
        </ul>
      )}
    </>
  );
};

export default Steps;
