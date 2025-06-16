import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { Entity } from '@backstage/catalog-model';

import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
} from '@backstage/catalog-model';

export class MobileEntityProvider implements EntityProvider {
  private connection!: EntityProviderConnection;
  constructor(private readonly providerName: string) {}

  getProviderName(): string {
    return this.providerName;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.run();
  }

  async run(): Promise<void> {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const entityResponse = await fetch('https://api.restful-api.dev/objects');
    const data = await entityResponse.json();

    const entities: Entity[] = data.map((item: any) => ({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: item.id,
        annotations: {
          [ANNOTATION_LOCATION]: 'hr-user-https://www.hrurl.com/',
          [ANNOTATION_ORIGIN_LOCATION]: 'hr-user-https://www.hrurl.com/',
        },
        description: item.name,
      },
      spec: {
        type: 'Product',
        lifecycle: 'experimental',
        owner: item.owner || 'team-a',
      },
    }));

    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({
        entity,
        locationKey: this.providerName,
      })),
    });
  }
}
