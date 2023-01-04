import { KeystoneContext } from '@keystone-next/types';
import { OrderCreateInput } from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';
import { Session } from '../types';

const graphql = String.raw;

interface IArguments {
  token: string;
}

interface IPhoto {
  id: string;
}

interface IProduct {
  id: string;
  price: number;
  name: string;
  description: string;
  photo: IPhoto;
}

interface ICartItem {
  id: string;
  quantity: number;
  product: IProduct;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  cart: ICartItem[];
}

export default async function checkout(
  _root: undefined,
  { token }: IArguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  const session = context.session as Session;
  if (!session.itemId) {
    throw new Error('Sorry! You must be signed in to create an order');
  }

  const user = (await context.lists.User.findOne({
    where: { id: session.itemId },
    resolveFields: graphql`
      id 
      name 
      email 
      cart { 
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `,
  })) as IUser;

  const cartItems = user.cart.filter((cartItem) => cartItem.product);

  const amount = cartItems.reduce(
    (tally, cartItem) => tally + cartItem.product.price * cartItem.quantity,
    0
  );

  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((err: Error) => {
      console.log(err);
      throw new Error(err.message);
    });

  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    };
    return orderItem;
  });

  const order: OrderCreateInput = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: session.itemId } },
    },
  });

  const cartItemIds = user.cart.map((cartItem) => cartItem.id);
  await context.lists.CartItem.deleteMany({ ids: cartItemIds });

  return order as Promise<OrderCreateInput>;
}
