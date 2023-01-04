import PropTypes from 'prop-types';
import Order from '../../components/Order';

export default function SingleOrderPage({ query }) {
  if (!query.id) {
    return null;
  }
  return <Order id={query.id} />;
}

SingleOrderPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string,
  }),
};
