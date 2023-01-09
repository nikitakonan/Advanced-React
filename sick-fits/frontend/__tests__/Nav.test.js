import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import Nav from '../components/Nav';
import { CURRENT_USER_QUERY } from '../components/User';
import { CartStateProvider } from '../lib/cartState';
import { fakeCartItem, fakeUser } from '../lib/testUtils';

describe('<Nav />', () => {
  it('Renders and minimal nav when signed out', () => {
    const { container } = render(
      <CartStateProvider>
        <MockedProvider
          mocks={[
            {
              request: { query: CURRENT_USER_QUERY },
              result: { data: { authenticatedItem: null } },
            },
          ]}
        >
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    expect(container).toHaveTextContent('Sign In');
    expect(container).toMatchSnapshot();
    const link = screen.getByText('Sign In');
    expect(link).toHaveAttribute('href', '/signin');
    const productsLink = screen.getByText('Products');
    expect(productsLink).toBeInTheDocument();
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  it('Renders a full nav when signed in', async () => {
    const { container } = render(
      <CartStateProvider>
        <MockedProvider
          mocks={[
            {
              request: { query: CURRENT_USER_QUERY },
              result: { data: { authenticatedItem: fakeUser() } },
            },
          ]}
        >
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByText('Account');
    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent('Sign Out');
    expect(container).toHaveTextContent('My Cart');
  });

  it('Renders the amount of items in the cart', async () => {
    render(
      <CartStateProvider>
        <MockedProvider
          mocks={[
            {
              request: { query: CURRENT_USER_QUERY },
              result: {
                data: {
                  authenticatedItem: fakeUser({ cart: [fakeCartItem()] }),
                },
              },
            },
          ]}
        >
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByText('Account');
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
