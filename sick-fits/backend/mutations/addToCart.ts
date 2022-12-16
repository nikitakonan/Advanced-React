import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productID }: { productID: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // 1 query current user see if they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('you must be logged in');
  }
  // 2 query current user cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: {
      user: { id: sesh.itemId },
      product: { id: productID },
    },
    resolveFields: 'id, quantity',
  });
  const [existingCartItem] = allCartItems as { id: string; quantity: number }[];
  // 3 see if current item is in their cart
  // 4 if it is increment by 1
  if (existingCartItem) {
    return context.lists.CartItem.updateOne({
      resolveFields: 'id, quantity',
      id: existingCartItem.id,
      data: {
        quantity: existingCartItem.quantity + 1,
      },
    }) as Promise<CartItemCreateInput>;
  }
  // 5 if isn't create new cart item
  return context.lists.CartItem.createOne({
    resolveFields: 'id, quantity',
    data: {
      product: { connect: { id: productID } },
      user: { connect: { id: sesh.itemId } },
    },
  }) as Promise<CartItemCreateInput>;
}
