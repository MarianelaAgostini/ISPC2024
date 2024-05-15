import React from "react";
import useFetchCollection from "../../hooks/useFetchCollection";
import { useTranslation } from 'react-i18next';


import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top",
		},
		title: {
			display: true,
			text: "Order Status",
		},
	},
};

const chart = () => {
	const { orderHistory } = useSelector((store) => store.order);
	const filteredOrders = orderHistory.map((item) => item.orderStatus);
	const { t } = useTranslation();

	const getOrderCount = (arr, value) => {
		return arr.filter((item) => item === value).length;
	};

	const placed = getOrderCount(filteredOrders, t('Orden realizada'));
	const processing = getOrderCount(filteredOrders, t('Procesando'));
	const shipped = getOrderCount(filteredOrders, t('Objeto(s) Enviados'));
	const delivered = getOrderCount(filteredOrders, t('Objeto(s) Entregados'));

	const data = {
		labels: [t('Orden realizada'), t('Procesando'), t('Enviados'), t('Entregados')],
		datasets: [
			{
				label: t('Conteo de órdenes'),
				data: [placed, shipped, processing, delivered],
				backgroundColor: "#191a3ed6",
			},
		],
	};
	return <Bar options={options} data={data} />;
};

export default chart;
