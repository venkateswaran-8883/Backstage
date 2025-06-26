import { Page, Content } from '@backstage/core-components';
import { CatalogTable } from '@backstage/plugin-catalog';
import {
  EntityListProvider,
  EntityKindPicker,
  EntityTypePicker,
} from '@backstage/plugin-catalog-react';

export const MobileBrandsPage = () => {
  return (
    <Page themeId="tool">
      <Content>
        <EntityListProvider>
          <EntityKindPicker initialFilter="component" hidden />
          <EntityTypePicker initialFilter="mobile-brands" hidden />
          <CatalogTable title="Mobile Brands" />
        </EntityListProvider>
      </Content>
    </Page>
  );
};
