import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripeLib = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_KEY || 'fds;lkjfkd'
);

export default function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}
