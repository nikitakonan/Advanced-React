import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

export default async function addToCart(
  _root: undefined,
  { productID }: { productID: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('you must be logged in');
  }

  const allCartItems = await context.lists.CartItem.findMany({
    where: {
      user: { id: sesh.itemId },
      product: { id: productID },
    },
    resolveFields: 'id, quantity',
  });
  const [existingCartItem] = allCartItems as { id: string; quantity: number }[];
  if (existingCartItem) {
    return context.lists.CartItem.updateOne({
      resolveFields: 'id, quantity',
      id: existingCartItem.id,
      data: {
        quantity: existingCartItem.quantity + 1,
      },
    }) as Promise<CartItemCreateInput>;
  }
  return context.lists.CartItem.createOne({
    resolveFields: 'id, quantity',
    data: {
      product: { connect: { id: productID } },
      user: { connect: { id: sesh.itemId } },
    },
  }) as Promise<CartItemCreateInput>;
}
