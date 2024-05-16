import React, { useEffect, useState } from "react";
import useFetchCollection from "../../hooks/useFetchCollection";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { storeOrders } from "../../redux/slice/orderSlice";

import OrdersComponent from "../ordersComponent/OrdersComponent";
import { useTranslation } from 'react-i18next';

const Orders = () => {
	const { data, isLoading } = useFetchCollection("orders");
	const { orderHistory } = useSelector((store) => store.order);
	const { userId } = useSelector((store) => store.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();

	useEffect(() => {
		dispatch(storeOrders(data));
	}, [dispatch, data]);

	return (
		<>
			{isLoading && <Loader />}
			<h3 className="black text-xl md:text-3xl font-light mb-4">{t('Todas las órdenes')}</h3>
			<div>
				<OrdersComponent orders={orderHistory} user={false} admin={true} />
			</div>
		</>
	);
};

export default Orders;
