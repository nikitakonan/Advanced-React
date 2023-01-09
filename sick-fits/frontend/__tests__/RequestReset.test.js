import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RequestReset, {
  REQUEST_RESET_MUTATION,
} from '../components/RequestReset';

const email = 'nikita@email.com';

describe('<RequestReset />', () => {
  it('Renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('Calls the mutation when submitted', async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: { query: REQUEST_RESET_MUTATION, variables: { email } },
            result: { data: { sendUserPasswordResetLink: null } },
          },
        ]}
      >
        <RequestReset />
      </MockedProvider>
    );
    userEvent.type(screen.getByPlaceholderText(/email/i), email);
    userEvent.click(screen.getByText(/Request Reset/i));
    const success = await screen.findByText(/Success/i);
    expect(success).toBeInTheDocument();
  });
});
