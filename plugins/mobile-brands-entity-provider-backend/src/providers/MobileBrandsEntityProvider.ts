import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
} from '@backstage/catalog-model';
import fetch from 'node-fetch';
import { MobileBrandItem } from '../interfaces/MobileBrandTypes';

export class MobileBrandsEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection | undefined;

  getProviderName(): string {
    return 'mobile-brands-entity-provider';
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.run();
  }

  async run(): Promise<void> {
    if (!this.connection) {
      throw new Error('EntityProviderConnection not established');
    }

    const response = await fetch('https://api.restful-api.dev/objects');
    const data: MobileBrandItem[] =
      (await response.json()) as MobileBrandItem[];

    const entities: Entity[] = data.map((item: any) => ({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: item.name.toLowerCase().replace(/\s+/g, '-'),
        annotations: {
          [ANNOTATION_LOCATION]: 'url:https://api.restful-api.dev/objects',
          [ANNOTATION_ORIGIN_LOCATION]:
            'url:https://api.restful-api.dev/objects',
        },
      },
      spec: {
        type: 'mobile-brand',
        lifecycle: 'production',
        owner: 'user:default/admin',
      },
    }));

    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({
        entity,
        locationKey: 'mobile-brands',
      })),
    });
  }
}
