import React, { useEffect } from "react";
import { InfoBox, Chart } from "../../components";
import { BiDollar } from "react-icons/bi";
import { FaCartArrowDown } from "react-icons/fa";
import { BsCart } from "react-icons/bs";
import { formatPrice } from "../../utils/formatPrice";
//redux
import { useSelector, useDispatch } from "react-redux";
import { totalOrderAmount, storeOrders } from "../../redux/slice/orderSlice";
import useFetchCollection from "../../hooks/useFetchCollection";
import { useTranslation } from 'react-i18next';

const earningIcon = <BiDollar size={22} color="white" />;
const productIcon = <FaCartArrowDown size={22} color="white" />;
const orderIcon = <BsCart size={22} color="white" />;


const AdminHome = () => {
	const { data } = useFetchCollection("orders");
	const { products } = useSelector((store) => store.product);
	const { orderHistory, totalAmount } = useSelector((store) => store.order);
	const dispatch = useDispatch();
	const { t } = useTranslation();

	useEffect(() => {
		dispatch(storeOrders(data));
		dispatch(totalOrderAmount());
	}, [dispatch, data]);

	return (
		<main className="h-full border-r-2 p-1">
			<h3 className="text-xl md:text-3xl font-light mb-4">{t('Admin Home')}</h3>
			<section className="flex flex-wrap gap-10">
				<InfoBox title={t('Ganancias')} count={<span className="number">{formatPrice(totalAmount)}</span>} icon={earningIcon} />
				<InfoBox title={t('Productos')} count={<span className="number">{products.length}</span>} icon={orderIcon} />
				<InfoBox title={t('Órdenes')} count={<span className="number">{orderHistory.length}</span>} icon={productIcon} />
			</section>
			<div>
				<Chart />
			</div>
		</main>
	);
};

export default AdminHome;
