import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import AddToCart, { ADD_TO_CART_MUTATION } from '../components/AddToCart';

const id = 'kjlkj;lkj';

it('renders without errors', async () => {
  const mock = {
    request: {
      query: ADD_TO_CART_MUTATION,
      variables: { id },
    },
    result: { data: { addToCart: { id, quantity: 1 } } },
  };

  render(
    <MockedProvider mocks={[mock]} addTypename={false}>
      <AddToCart id={id} />
    </MockedProvider>
  );
  const button = screen.getByText(/To Cart/i);
  userEvent.click(button);
  expect(button).toHaveAttribute('type', 'button');
  expect(button.nodeName).toBe('BUTTON');
  expect(await screen.findByText(/adding to cart/i)).toBeInTheDocument();
  expect(await screen.findByText(/add to cart/i)).toBeInTheDocument();
});
