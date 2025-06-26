import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const mobileBrandsPlugin = createPlugin({
  id: 'mobile-brands',
  routes: {
    root: rootRouteRef,
  },
});

export const MobileBrandsPage = mobileBrandsPlugin.provide(
  createRoutableExtension({
    name: 'MobileBrandsPage',
    component: () =>
      import('./components/MobileBrands/MobileBrandsPage').then(
        m => m.MobileBrandsPage,
      ),
    mountPoint: rootRouteRef,
  }),
);
