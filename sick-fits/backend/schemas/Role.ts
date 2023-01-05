import { relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { permissions } from '../access';
import { permissionFields } from './fields';

export const Role = list({
  access: {
    create: permissions.canManageRoles,
    read: permissions.canManageRoles,
    update: permissions.canManageRoles,
    delete: permissions.canManageRoles,
  },
  fields: {
    name: text({
      isRequired: true,
    }),
    assignedTo: relationship({
      ref: 'User.role',
      many: true,
      ui: {
        itemView: { fieldMode: 'read' },
      },
    }),
    ...permissionFields,
  },
  ui: {
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    isHidden: (args) => !permissions.canManageRoles(args),
    listView: {
      initialColumns: [
        'name',
        'assignedTo',
        'canManageCart',
        'canManageOrders',
        'canManageProducts',
        'canManageRoles',
        'canManageUsers',
        'canSeeOtherUsers',
      ],
    },
  },
});
