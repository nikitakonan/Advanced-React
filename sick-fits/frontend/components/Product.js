import Link from 'next/link';
import PropTypes from 'prop-types';
import formatMoney from '../lib/formatMoney';
import AddToCart from './AddToCart';
import DeleteProduct from './DeleteProduct';
import styles from './styles/product.module.css';

export default function Product({ product }) {
  return (
    <div className={styles['product-item']}>
      <img
        className={styles['product-item__img']}
        src={product?.photo?.image?.publicUrlTransformed}
        alt={product.name}
      />
      <h3 className={styles['product-item__title']}>
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </h3>
      <span className={styles['product-item__price-tag']}>
        {formatMoney(product.price)}
      </span>
      <p className={styles['product-item__desc']}>{product.description}</p>
      <div className={styles['product-item__button-list']}>
        <Link href={{ pathname: `/update`, query: { id: product.id } }}>
          Edit ✏️
        </Link>
        <AddToCart id={product.id} />
        <DeleteProduct id={product.id}>Delete ❌</DeleteProduct>
      </div>
    </div>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    photo: PropTypes.shape({
      image: PropTypes.shape({
        publicUrlTransformed: PropTypes.string,
      }),
    }),
  }),
};
