import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineVerified } from "react-icons/md";
import { useTranslation } from 'react-i18next';

const CheckoutSuccess = () => {
	const { t } = useTranslation();
	return (
		<section className="flex items-center justify-center w-full h-[80vh]">
			<div className="rounded-md shadow-lg p-10 bg-base-100 flex flex-col items-center w-[30rem] gap-5">
				<MdOutlineVerified size={60} color="#516ff9" />
				<h1 className="text-4xl font-semibold text-center">
					{t('¡Hurra! Tu pedido fue confirmado')}
				</h1>
				<p className="font-light text-gray-600 text-lg">{t('Gracias por comprar con nosotros')} </p>
				<Link to="/my-orders" className="btn btn-primary btn-lg mt-5 ">
					{t('Ver estado del pedido')}
				</Link>
			</div>
		</section>
	);
};

export default CheckoutSuccess;
