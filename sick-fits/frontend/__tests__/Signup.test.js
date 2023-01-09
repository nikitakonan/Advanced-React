import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup, { SIGNUP_MUTATION } from '../components/SignUp';
import { fakeUser } from '../lib/testUtils';

const me = fakeUser();
const password = '12345678';

describe('<Signup />', () => {
  it('Renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('Calls the mutation properly', async function () {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: SIGNUP_MUTATION,
              variables: { name: me.name, email: me.email, password },
            },
            result: {
              data: {
                createUser: {
                  id: 'abc123',
                  email: me.email,
                  name: me.name,
                },
              },
            },
          },
        ]}
        addTypename={false}
      >
        <Signup />
      </MockedProvider>
    );

    userEvent.type(screen.getByPlaceholderText(/name/i), me.name);
    userEvent.type(screen.getByPlaceholderText(/email/i), me.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), password);
    userEvent.click(screen.getByText('Sign Up!'));
    await screen.findByText(
      `Signed up with ${me.email} - Please Go Head and Sign in!`
    );
  });
});
