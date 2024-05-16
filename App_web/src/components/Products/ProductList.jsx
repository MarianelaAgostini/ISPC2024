import { useEffect, useState } from "react";
import { ListView, GridView, Search, ProductFilter, Pagination } from "../../components";
import { BsFillGridFill, BsFilter } from "react-icons/bs";
import useDarkMode from "../../hooks/useDarkMode";
import { MdOutlineSubject } from "react-icons/md";
import { filterBySearch, sortProducts } from "../../redux/slice/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

const ProductList = ({ products }) => {
	const { filteredProducts } = useSelector((store) => store.filter);
	const [grid, setGrid] = useState(true);
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("latest");
	// Paginación
	const [currentPage, setCurrentPage] = useState(1);
	const [productPerPage, setProductPerPage] = useState(9);
	// Ir arriba
	const [bacToTop, setBackToTop] = useState(false);
	const dispatch = useDispatch();
	const [darkMode,] = useDarkMode();
	const { t } = useTranslation();

	//! Buscar
	useEffect(() => {
		dispatch(filterBySearch({ products, search }));
	}, [dispatch, products, search]);
	//! ORdenar
	useEffect(() => {
		dispatch(sortProducts({ products, sort }));
	}, [dispatch, products, sort]);

	useEffect(() => {
		// Ir abajo
		const event = window.addEventListener("scroll", () => {
			if (pageYOffset > 400) {
				setBackToTop(true);
			} else {
				setBackToTop(false);
			}
			() => removeEventListener(event);
		});
	}, []);

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}

	//Obtener el producto
	const indexOfLastProduct = currentPage * productPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productPerPage;
	const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

	return (
		<main className="relative">
			<header className="flex flex-col gap-y-4 xl:flex-row xl:items-center justify-between border-b pb-2">
				{/* Plantilla grid */}
				<div className="flex gap-2 items-center">
					<div className="flex gap-4">
						<BsFillGridFill
							size={28}
							onClick={() => setGrid(true)}
							className={` rounded-md p-1 ${grid ? "bg-neutral text-white" : null}`}
						/>
						<MdOutlineSubject
							size={28}
							onClick={() => setGrid(false)}
							className={` rounded-md p-1 ${grid ? null : "bg-neutral text-white"}`}
						/>
					</div>
					<h1>
						<span className="font-bold">{filteredProducts.length} </span>- {t('productos encontrados')}
					</h1>
				</div>
				{/* Search Bar */}
				<Search value={search} onChange={(e) => setSearch(e.target.value)} />
				{/* Sorting List */}
				<div className="m-4 flex gap-2 items-center">
					<h2>{t('Ordenar por')}:</h2>
					<select
						value={sort}
						className="select select-sm select-bordered"
						onChange={(e) => setSort(e.target.value)}
					>
						<option value="latest">{t('Últimos')}</option>
						<option value="lowest-price">{t('Menor precio')}</option>
						<option value="highest-price">{t('Mayor precio')}</option>
						<option value="a2z">{t('Nombre(a - z)')}</option>
						<option value="z2a">{t('Nombre(z - a)')}</option>
					</select>
				</div>
				{/* Collapse for Filter  */}
				<div className="collapse sm:hidden">
					<input type="checkbox" className="peer" />
					<div className="collapse-title rounded-sm bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content w-80 flex items-center justify-between">
						<p>{t('Mostrar filtros')}</p>
						<BsFilter size={28} />
					</div>
					<div className="collapse-content bg-primary text-primary-content peer-checked:bg-white peer-checked:text-black w-80 border-2 ">
						{/* Filter Component */}
						<ProductFilter />
					</div>
				</div>
			</header>
			<section>
				{grid ? (
					<GridView products={currentProducts} />
				) : (
					<ListView products={currentProducts} />
				)}
			</section>
			{bacToTop && (
				<div className="fixed bottom-5 right-5">
					<button
						className="btn btn-primary sm:btn-lg rounded-full"
						onClick={scrollToTop}
					>
						&uarr; {t('Volver arriba')}
					</button>
				</div>
			)}
			<Pagination
				productPerPage={productPerPage}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				totalProducts={filteredProducts.length}
			/>
		</main>
	);
};

export default ProductList;
