import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import knex from 'knex';
import { createRouter } from './router';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { createUserService } from './services/userService';

/**
 * userManagementPlugin backend plugin
 *
 * @public
 */
export const userManagementPlugin = createBackendPlugin({
  pluginId: 'user-management',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        catalog: catalogServiceRef,
      },
      async init({ logger, httpRouter }) {
        const database = knex({
          client: 'better-sqlite3',
          connection: {
            filename: ':memory:',
          },
          useNullAsDefault: true,
        });

        const userService = await createUserService({
          logger,
          database,
        });

        httpRouter.use(
          await createRouter({
            userService,
          }),
        );
      },
    });
  },
});
