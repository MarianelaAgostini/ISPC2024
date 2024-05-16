import { Link } from "react-router-dom";
// lazy load
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { formatPrice } from "../../utils/formatPrice";
import { useTranslation } from 'react-i18next';

const OrderTable = ({ user, order }) => {
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto">
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th className="text-sm md:text-lg">{t('Producto')}</th>
            {user && <th className="text-sm md:text-lg">{t('Acciones')}</th>}
          </tr>
        </thead>
        <tbody>
          {order.cartItems.map((product, index) => {
            const { id: productId, name, price, imageURL, qty } = product;
            return (
              <tr key={index}>
                <td>
                  <Link to={`/product-details/${productId}`}>
                    <LazyLoadImage
                      src={
                        imageURL ||
                        `https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png`
                      }
                      alt={name}
                      className="w-10 sm:w-24 object-fill"
                      placeholderSrc="https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"
                      effect="blur"
                    />
                    <div className="md:text-lg">{name}</div>
                    <div className="md:text-lg font-medium">
                      {t('Cantidad')}:
                      <span className="md:text-lg font-medium text-primary">{qty}</span>
                    </div>
                    <div className="md:text-lg font-medium">
                      {t('Total')}:
                      <span className="md:text-lg font-medium text-primary">
                        {formatPrice(price * qty)}
                      </span>
                    </div>
                  </Link>
                </td>
                {user && (
                  <td>
                    <Link
                      to={`/all`}
                      className="border p-2 rounded-md md:text-lg"
                    >
                      {t('Escribe una reseña')}
                    </Link>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
