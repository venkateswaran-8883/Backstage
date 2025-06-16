import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { MobileEntityProvider } from './mobileEntityProvider';

export const catalogModuleMobileEntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'mobile-entity-provider',
  register(reg) {
    reg.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        logger: coreServices.logger,
      },
      async init({ logger, catalog }) {
        logger.info('mobile entity provider initialised');
        const custoemEntity = new MobileEntityProvider('mobiledata');
        catalog.addEntityProvider(custoemEntity);
        logger.info('mobile entities added to catalog');
      },
    });
  },
});
