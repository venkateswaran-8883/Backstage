import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const userManagementPlugin = createPlugin({
  id: 'user-management',
  routes: {
    root: rootRouteRef,
  },
});

export const UserManagementPage = userManagementPlugin.provide(
  createRoutableExtension({
    name: 'UserManagementPage',
    component: () =>
      import('./components/UserComponent').then(m => m.UserComponent),
    mountPoint: rootRouteRef,
  }),
);
