import { Permission, permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

type AccessFunc = (args: ListAccessArgs) => boolean;
type TEntry = [Permission, AccessFunc];
type TPermission = {
  [Property in Permission]: AccessFunc;
};

const entries = permissionsList.map(
  (permission) =>
    [
      permission,
      function permissionFunc({ session }) {
        return !!session?.data.role?.[permission];
      },
    ] as TEntry
);
const generatedPermissions = Object.fromEntries(entries) as TPermission;

export const permissions = {
  ...generatedPermissions,
};

interface IdWhere {
  id: string;
}

interface UserWhere {
  user: IdWhere;
}

interface OrderUserWhere {
  order: UserWhere;
}

interface ProductWhere {
  status: 'AVAILABLE' | 'DRAFT' | 'UNAVAILABLE';
}

// Rule based function
export const rules = {
  canManageProducts: (args: ListAccessArgs): boolean | UserWhere => {
    if (!isSignedIn(args)) {
      return false;
    }
    if (permissions.canManageProducts(args)) {
      return true;
    }
    return { user: { id: args.session.itemId } };
  },
  canOrder: (args: ListAccessArgs): boolean | UserWhere => {
    if (!isSignedIn(args)) {
      return false;
    }
    if (permissions.canManageCart(args)) {
      return true;
    }
    return { user: { id: args.session.itemId } };
  },
  canManageOrderItems: (args: ListAccessArgs): boolean | OrderUserWhere => {
    if (!isSignedIn(args)) {
      return false;
    }
    if (permissions.canManageCart(args)) {
      return true;
    }
    return { order: { user: { id: args.session.itemId } } };
  },
  canReadProducts: (args: ListAccessArgs): boolean | ProductWhere => {
    if (!isSignedIn(args)) {
      return false;
    }
    if (permissions.canManageProducts(args)) {
      return true;
    }
    // only see available products
    return {
      status: 'AVAILABLE',
    };
  },
  canManageUsers: (args: ListAccessArgs): boolean | IdWhere => {
    if (!isSignedIn(args)) {
      return false;
    }
    if (permissions.canManageUsers(args)) {
      return true;
    }
    return { id: args.session.itemId };
  },
};
