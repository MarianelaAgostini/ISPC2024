import { useEffect, useState } from "react";
//  Utilities
import { getUniqueValues } from "../../utils/uniqueValues";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { filterByCategory, filterByBrand, filterByprice } from "../../redux/slice/filterSlice";
import { formatPrice } from "../../utils/formatPrice";
import { useTranslation } from 'react-i18next';
import useDarkMode from "../../hooks/useDarkMode";

const ProductFilter = () => {
	const { products } = useSelector((store) => store.product);
	const { minPrice, maxPrice } = useSelector((store) => store.product);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const darkMode = useDarkMode();

	const [category, setCategory] = useState("All");
	const [brand, setBrand] = useState("All");
	const [price, setPrice] = useState(maxPrice);

	// Obtener el array de marcas y categorías
	const allCategories = getUniqueValues(products, "category");
	const allBrands = getUniqueValues(products, "brand");
	//! Categorías
	const filterProducts = (c) => {
		setCategory(c);
		dispatch(filterByCategory({ products, category: c }));
	};
	//! Marca
	useEffect(() => {
		dispatch(filterByBrand({ products, brand }));
	}, [dispatch, products, brand]);

	//!Precio
	useEffect(() => {
		dispatch(filterByprice({ products, price }));
	}, [dispatch, products, price]);

	function clearFilter() {
		setCategory("All");
		setBrand("All");
		setPrice(maxPrice);
	}

	return (
		<div className="flex flex-col gap-y-5">
			{/* Categorias */}
			<div>
				<div className={`flex flex-col gap-y-2 items-start`}>
					{allCategories.map((c, index) => {
				<h3 className="font-bold">{t('Categorías')}</h3>
						return (
							<button
								key={index}
								type="button"
								className={`w-full text-left btn neutral ${
									category === c
										? "border-l-4 border-primary px-2 font-semibold"
										: null
								}`}
								onClick={() => filterProducts(c)}
							>
								{c}
							</button>
						);
					})}
				</div>
			</div>
			{/* marca */}
			<div>
				<h1 className="font-bold">{t('Marca')}</h1>
				<select
					className="select select-bordered w-full"
					name="brand"
					onChange={(e) => setBrand(e.target.value)}
				>
					{allBrands.map((b, index) => {
						return (
							<option key={index} value={b}>
								{b}
							</option>
						);
					})}
				</select>
			</div>
			{/* precio */}
			<div>
				<h1 className="font-bold">{t('Precio')}</h1>
				<h2>{formatPrice(price)}</h2>
				<input
					className="range range-primary"
					type="range"
					value={price}
					min={minPrice}
					max={maxPrice}
					onChange={(e) => setPrice(e.target.value)}
				/>
			</div>
			<div>
				<button className="btn btn-error" onClick={clearFilter}>
					{t('Borrar filtros')}
				</button>
			</div>
		</div>
	);
};

export default ProductFilter;
