import ReactDOM from "react-dom";
import { useTranslation } from 'react-i18next';

const Loader = () => {
  const { t } = useTranslation();
  return ReactDOM.createPortal(
    <div className="overlay">
      <div>
        <h1 className="text-xl font-semibold"> {t('Espera, esto puede tardar un poco')}.</h1>
        <div className="loader"></div>
      </div>
    </div>,
    document.getElementById("loader")
  );
  // return (
  // 	<div className="overlay">
  // 		<div class="loader"></div>
  // 	</div>
  // );
};

export default Loader;
