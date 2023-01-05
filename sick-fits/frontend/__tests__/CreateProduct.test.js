import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import wait from 'waait';
import Router from 'next/router';
import CreateProduct, {
  CREATE_PRODUCT_MUTATION,
} from '../components/CreateProduct';
import { fakeItem } from '../lib/testUtils';

const item = fakeItem();

const mocks = [
  {
    request: {
      query: CREATE_PRODUCT_MUTATION,
      variables: {
        name: item.name,
        description: item.description,
        image: '',
        price: item.price,
      },
    },
    result: {
      data: {
        createProduct: {
          ...item,
          id: 'abc123',
          __typename: 'Product',
        },
      },
    },
  },
];

jest.mock('next/router', () => ({
  push: jest.fn(),
}));

describe('<CreateProduct />', () => {
  it('Renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('Handles the updating', () => {
    render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );

    userEvent.type(screen.getByPlaceholderText(/Name/i), item.name);
    userEvent.type(
      screen.getByPlaceholderText(/Price/i),
      item.price.toString()
    );
    userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      item.description
    );

    expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.price)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
  });

  it('Creates the items when the form is submitted', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <CreateProduct />
      </MockedProvider>
    );
    userEvent.type(screen.getByPlaceholderText(/Name/i), item.name);
    userEvent.type(
      screen.getByPlaceholderText(/Price/i),
      item.price.toString()
    );
    userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      item.description
    );

    userEvent.click(screen.getByText(/Add Product/));
    await waitFor(() => wait(0));
    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith({ pathname: '/product/abc123' });
  });
});
