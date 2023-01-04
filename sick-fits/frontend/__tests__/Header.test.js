import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';
import { CURRENT_USER_QUERY } from '../components/User';
import { CartStateProvider } from '../lib/cartState';

const mocks = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        authenticatedItem: null,
      },
    },
  },
];

it('Unauthenticated user renders sign in', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <CartStateProvider>
        <Header />
      </CartStateProvider>
    </MockedProvider>
  );
  expect(await screen.findByText('Sign In')).toBeInTheDocument();
});
