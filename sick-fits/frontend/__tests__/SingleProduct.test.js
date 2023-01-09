import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import SingleProduct, { SINGLE_ITEM_QUERY } from '../components/SingleProduct';
import { fakeItem } from '../lib/testUtils';

const product = fakeItem();

describe('<Single Product />', () => {
  it('Renders with proper data', async () => {
    const { container } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: SINGLE_ITEM_QUERY,
              variables: {
                id: '123',
              },
            },
            result: { data: { Product: product } },
          },
        ]}
      >
        <SingleProduct id="123" />
      </MockedProvider>
    );
    await screen.findByTestId('singleProduct');
    expect(container).toMatchSnapshot();
  });

  it('Errors out when an item is not found', async () => {
    const { container } = render(
      <MockedProvider
        mocks={[
          {
            request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
            result: { errors: [{ message: 'Item not found!!!' }] },
          },
        ]}
      >
        <SingleProduct id="123" />
      </MockedProvider>
    );
    await screen.findByTestId('graphql-error');
    expect(container).toHaveTextContent('Shoot!');
    expect(container).toHaveTextContent('Item not found!!!');
  });
});
