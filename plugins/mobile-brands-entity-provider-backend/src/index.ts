import {
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { MobileBrandsEntityProvider } from './providers/MobileBrandsEntityProvider';

export const moduleMobileBrands = createBackendModule({
  moduleId: 'mobile-brands-entity-provider',
  pluginId: 'catalog',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        catalogProcessing: catalogProcessingExtensionPoint,
      },
      async init({ logger, catalogProcessing }) {
        logger.info('Initializing MobileBrandsEntityProvider...');
        const provider = new MobileBrandsEntityProvider();
        catalogProcessing.addEntityProvider(provider);
        logger.info('MobileBrandsEntityProvider registered successfully.');
      },
    });
  },
});
