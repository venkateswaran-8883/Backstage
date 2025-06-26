import { createDevApp } from '@backstage/dev-utils';
import { mobileBrandsPlugin, MobileBrandsPage } from '../src/plugin';

createDevApp()
  .registerPlugin(mobileBrandsPlugin)
  .addPage({
    element: <MobileBrandsPage />,
    title: 'Root Page',
    path: '/mobile-brands',
  })
  .render();
