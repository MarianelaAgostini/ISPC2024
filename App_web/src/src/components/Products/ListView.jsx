import React from "react";
import { formatPrice } from "../../utils/formatPrice";
import { Link } from "react-router-dom";
//  lazy load
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// redux
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slice/cartSlice";
import { useTranslation } from 'react-i18next';

const ListView = ({ products }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	if (!products.length) {
		return <h1 className="text-3xl font-bold">{t('No se encontraron productos')}</h1>;
	}

	function add2CartFunction(product) {
		dispatch(addToCart(product));
	}

	return (
		<div className="w-full flex flex-col gap-y-5 py-10">
			{products.map((product) => {
				return (
					<div key={product.id} className="mx-auto ">
						<div className="flex flex-col xl:flex-row gap-x-5 relative shadow-md hover:scale-105 duration-300 p-2 items-center">
							<LazyLoadImage
								src={product.imageURL}
								alt={product.name}
								className="block w-60 h-60 object-contain rounded-md"
								placeholderSrc="https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"
								effect="blur"
							/>
							<div className=" absolute top-0 right-0">
								<span className="badge ">{t('Envío gratis')}</span>
							</div>
							<div className="flex-1">
								<h1 className="font-semibold">{product.brand}</h1>
								<h1 className="font-semibold pb-2">{product.name}</h1>
								<p className="py-2 text-xl font-semibold">
									{formatPrice(product.price)}
								</p>
								<p>{product.description.slice(0, 150)}...</p>

								<button
									onClick={() => add2CartFunction(product)}
									className="btn btn-sm btn-outline mr-4"
								>
									{t('Añadir al carro')}
								</button>
								<Link to={`/product-details/${product.id}`}>
									<button className="btn btn-sm btn-primary mt-2">
										{t('Ver detalles')}
									</button>
								</Link>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default React.memo(ListView);
