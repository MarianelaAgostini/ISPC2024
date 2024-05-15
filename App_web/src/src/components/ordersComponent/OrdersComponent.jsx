import React from "react";
import { formatPrice } from "../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const OrdersComponent = ({ orders, user, admin }) => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	function handleUserClick(orderId) {
		navigate(`/order-details/${orderId}`);
	}
	function handleAdminClick(orderId) {
		navigate(`/admin/order-details/${orderId}`);
	}

	return (
		<main>
			{!orders.length ? (
				<h3 className="black text-2xl font-bold"> {t('No se encontraron órdenes')} </h3>				
			) : (
				<div>
					<p className="black text-lg font-light">
						{t('Abra la orden para')} (
						{admin ? (
							<span className="black font-semibold text-primary">{t('Modificar Estado del Pedido')}</span>
						) : (
							<span className="font-semibold text-primary">{t('Seguir Estado del Pedido')}</span>
						)}
						)
					</p>

					{orders.map((order, index) => {
						const { id, orderDate, orderAmount, orderStatus, email } = order;
						return (
							<section
								className="w-full my-6 shadow-md rounded-md cursor-pointer hover:bg-base-200 duration-200"
								key={index}
								onClick={() => {
									user ? handleUserClick(id) : handleAdminClick(id);
								}}
							>
								<div className="p-4 bg-base-200">
									<div className="flex items-center justify-between gap-6">
										<div className="flex flex-col md:flex-row gap-x-10">
											<p className="text-gray-500 text-sm md:text-lg ">
												{t('Orden realizada')} : <br />{" "}
												<span className="text-primary">{orderDate}</span>
											</p>
											<p className="text-gray-500 text-sm md:text-lg ">
												{t('Enviado a')} : <br />{" "}
												<span className="text-primary">
													{email.split("@")[0]}
												</span>
											</p>
										</div>

										<p className="text-gray-500 text-sm md:text-lg">
											{t('Total')} :
											<span className="text-primary">
												{formatPrice(orderAmount)}
											</span>
										</p>
									</div>
								</div>
								<div className="p-4 flex items-center justify-between">
									<p className="text-sm md:text-lg">
										ID: <span className="font-semibold "> {id}</span>
									</p>
									<p className="black text-sm md:text-lg ">
										{t('Estado')}: <br />{" "}
										<span
											className={`font-semibold ${
												orderStatus !== t('Objeto(s) Entregados')
													? "text-neutral"
													: "text-green-600"
											}`}
										>
											{orderStatus}
										</span>
									</p>
								</div>
							</section>
						);
					})}
				</div>
			)}
		</main>
	);
};

export default OrdersComponent;
