import { useMutation } from '@apollo/client';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import nProgress from 'nprogress';
import { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../lib/cartState';
import SickButton from './styles/SickButton';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

export default function CheckoutForm() {
  const [error, setError] = useState();
  const [, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, { error: gqlError }] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    nProgress.start();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if (error) {
      setError(error);
      nProgress.done();
      return;
    }

    const order = await checkout({
      variables: { token: paymentMethod.id },
    });

    router.push({
      pathname: `/order`,
      query: { id: order.data.checkout.id },
    });
    closeCart();

    setLoading(false);
    nProgress.done();
  };
  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      {gqlError && <p style={{ fontSize: 12 }}>{gqlError.message}</p>}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
}
