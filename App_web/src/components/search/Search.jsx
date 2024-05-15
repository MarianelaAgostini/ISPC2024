import React from "react";
import { BiSearch } from "react-icons/bi";
import { useTranslation } from "react-i18next";
const Search = ({ value, onChange }) => {
	const {t}=useTranslation();
	return (
		<div>
			<div className="input-group">
				<input
					type="text"
					value={value}
					onChange={onChange}
					placeholder={t('Buscar por nombre')}
					className="input input-bordered w-[300px]"
				/>
				<button className="btn btn-square">
					<BiSearch size={24} />
				</button>
			</div>
		</div>
	);
};

export default Search;
