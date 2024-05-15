import React, { useState } from "react";
import { toast } from "react-toastify";
// FIREBASE
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";
import Loader from "../../components/loader/Loader";
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [err, setErr] = useState("");
	const { t } = useTranslation();
	const resetPasswordHandler = (e) => {
		e.preventDefault();
		setIsLoading(true);
		sendPasswordResetEmail(auth, email)
			.then(() => {
				toast.info(t('Revisa tu correo electrónico para el enlace de restablecimiento'));
				setErr(t('Revisa tu dirección de correo electrónico registrada para el enlace de restablecimiento (revisa el spam)'));
				setIsLoading(false);
				setEmail("");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				setErr(`${errorCode} : ${errorMessage}`);
				setIsLoading(false);
			});
	};

	return (
		<>
			{isLoading && <Loader />}

			<main className="w-full page flex items-center justify-center">
				<div className="w-96 h-auto shadow-xl rounded-md px-4 py-6">
					<h1 className="text-2xl font-bold text-center ">{t('Reestablecer contraseña')}</h1>
					{err && (
						<h1 className="alert shadow-lg text-gray-700 border-l-4 border-error my-4">
							{err}
						</h1>
					)}
					<div className="alert shadow-lg text-gray-700 border-l-4 border-primary my-4">
						{t('Por favor, ingresa tu dirección de correo electrónico registrada. Recibirás un mensaje de correo electrónico con instrucciones sobre cómo restablecer tu contraseña.')}
					</div>

					<form className="form-control" onSubmit={resetPasswordHandler}>
						<label className="label-text font-bold mb-2 block">{t('Dirección de correo')}</label>
						<input
							type="email"
							className="input input-bordered input-secondary w-full"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<button type="submit" className="btn mt-3">
							{t('Obtener nueva contraseña')}
						</button>
					</form>
				</div>
			</main>
		</>
	);
};

export default ResetPassword;
