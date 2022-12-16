import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const RemoveFromCartStyles = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

export default function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update(cache, payload) {
      cache.evict(cache.identify(payload.data.deleteCartItem));
    },
  });
  return (
    <RemoveFromCartStyles
      disabled={loading}
      onClick={removeFromCart}
      type="button"
      title="Remove this item from cart"
    >
      ❌
    </RemoveFromCartStyles>
  );
}

RemoveFromCart.propTypes = {
  id: PropTypes.string,
};
