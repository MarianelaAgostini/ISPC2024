import { useState } from "react";
import { Breadcrumbs } from "../../components";
import { useNavigate } from "react-router-dom";

//Redux
import { useDispatch } from "react-redux";
import { saveShippingAddress, saveBillingAddress } from "../../redux/slice/checkoutSlice";
import { useTranslation } from 'react-i18next';

const defaultValues = {
	name: "",
	line1: "",
	line2: "",
	city: "",
	pin_code: "",
	country: "",
	phone: "",
};

const CheckoutDetails = () => {
	const [shippingAddress, setShippingAddress] = useState(defaultValues);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();

	function handleShipping(e) {
		const { name, value } = e.target;
		setShippingAddress({ ...shippingAddress, [name]: value });
	}

	function handleSubmit(e) {
		e.preventDefault();
		dispatch(saveShippingAddress(shippingAddress));
		dispatch(saveBillingAddress(shippingAddress));
		navigate("/checkout");
		setShippingAddress(defaultValues);
	}

	const AllFieldsRequired =
		Boolean(shippingAddress.name) &&
		Boolean(shippingAddress.line1) &&
		Boolean(shippingAddress.line2) &&
		Boolean(shippingAddress.city) &&
		Boolean(shippingAddress.country) &&
		Boolean(shippingAddress.pin_code) &&
		Boolean(shippingAddress.phone);

	return (
		<main className="w-full">
			<section className="w-full mx-auto p-4 lg:p-10 lg:w-9/12 md:px-6 flex flex-col h-full">
				<article className="flex flex-col-reverse  md:flex-row gap-4">
					<div className="flex-1 p-4 rounded-md shadow-lg">
						<h1 className="text-3xl font-light">{t('Dirección de envío')}</h1>
						<form onSubmit={handleSubmit} className="form-control mt-2">
							<div className="mt-2">
								<label className="label-text mb-2 block text-lg">
									{t('Nombre del destinatario')} :
								</label>
								<input
									className="input input-sm text-lg input-bordered max-w-md w-full "
									type="text"
									name="name"
									value={shippingAddress.name}
									onChange={handleShipping}
									required
								/>
							</div>
							<div className="mt-2">
								<label className="label-text mb-2 block text-lg">
									{t('Línea de dirección 1')}:
								</label>
								<input
									className="input input-sm text-lg input-bordered max-w-md w-full "
									type="text"
									name="line1"
									value={shippingAddress.line1}
									onChange={handleShipping}
									required
								/>
							</div>
							<div className="mt-2">
								<label className="label-text mb-2 block text-lg">
									{t('Línea de dirección 2')} :
								</label>
								<input
									className="input input-sm text-lg input-bordered max-w-md w-full "
									type="text"
									name="line2"
									value={shippingAddress.line2}
									onChange={handleShipping}
									required
								/>
							</div>

							<div className="mt-2">
								<label className="label-text mb-2 block text-lg">{t('Ciudad')}:</label>
								<input
									className="input input-sm text-lg input-bordered max-w-md w-full "
									type="text"
									name="city"
									value={shippingAddress.city}
									onChange={handleShipping}
									required
								/>
							</div>
							<div className="mt-2">
								<label className="label-text mb-2 block text-lg">{t('Código postal')}:</label>
								<input
									className="input input-sm text-lg input-bordered max-w-md w-full "
									type="text"
									name="pin_code"
									value={shippingAddress.pin_code}
									onChange={handleShipping}
									required
								/>
							</div>
							<div className="mt-2">
								<label className="label-text mb-2 block text-lg">{t('País')}:</label>
								<input
									className="input input-sm text-lg input-bordered max-w-md w-full "
									type="text"
									name="country"
									value={shippingAddress.country}
									onChange={handleShipping}
									required
								/>
							</div>
							<div className="mt-2 mb-4">
								<label className="label-text mb-2 block text-lg">{t('Teléfono')}:</label>
								<input
									className="input input-sm text-lg input-bordered max-w-md w-full "
									type="text"
									name="phone"
									value={shippingAddress.phone}
									onChange={handleShipping}
									required
								/>
							</div>
							<button
								type="submit"
								className="btn btn-primary max-w-sm w-full"
								disabled={!AllFieldsRequired}
							>
								{t('Proceder al pago')}
							</button>
						</form>
					</div>
				</article>
			</section>
		</main>
	);
};

export default CheckoutDetails;
