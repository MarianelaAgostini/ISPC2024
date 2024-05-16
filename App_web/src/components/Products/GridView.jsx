import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { FcSearch } from "react-icons/fc";
//  lazy load
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// redux
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slice/cartSlice";
import { useTranslation } from 'react-i18next';
import useDarkMode from "../../hooks/useDarkMode";

const GridView = ({ products }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const darkMode = useDarkMode();
	if (!products.length) {
		return <h1 className="text-3xl font-bold">{t('No se encontraron productos')}</h1>;
	}

	function add2CartFunction(product) {
		dispatch(addToCart(product));
	}

	return (
		<div className=" flex flex-wrap gap-y-5 py-10 ">
			{products.map((product) => {
				const { id, imageURL, name, price } = product;
				return (
					<div key={id} className="mx-auto ">
						<div className="group">
							<div className={`card w-72 shadow-md relative hover:scale-105 duration-300 items-center bg-accent p-4 rounded-lg flex flex-col mb-2 bg-${darkMode ? 'dark' : 'neutral'}`}>
								<LazyLoadImage
									src={imageURL}
									alt={name}
									className="h-60 object-contain rounded-md"
									placeholderSrc="https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"
									effect="blur"
								/>
								<div className=" absolute top-0 right-0">
									<span className="badge badge-primary">{t('Envío gratis')}</span>
								</div>
								<div className="my-4 items-center text-center">
									<h1 className="font-semibold py-2">{name}</h1>
									<h2 className="py-2 text-lg">{formatPrice(price)}</h2>
								</div>
								<div className="absolute top-0 right-0 h-full w-full group-hover:bg-[rgba(0,0,0,0.5)] duration-300"></div>
								<Link to={`/product-details/${id}`}>
									<button className="absolute top-1/3 left-[45%] hidden group-hover:block transition-all ease-in duration-300">
										<FcSearch size={32} />
									</button>
								</Link>
								<button
									className="absolute bottom-1 btn btn-sm btn-primary hidden group-hover:block transition-all ease-in duration-300"
									onClick={() => add2CartFunction(product)}
								>
									{t('Añadir al carro')}
								</button>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default React.memo(GridView);
