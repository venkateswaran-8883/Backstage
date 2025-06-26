import { render, screen } from '@testing-library/react';
import { MobileBrandsPage } from './MobileBrandsPage';
import { ThemeProvider } from '@material-ui/core/styles';
import { lightTheme } from '@backstage/theme';

jest.mock('@backstage/plugin-catalog', () => ({
  CatalogTable: ({ title }: { title: string }) => <div>{title}</div>,
}));

jest.mock('@backstage/plugin-catalog-react', () => ({
  EntityListProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  EntityKindPicker: () => <div>EntityKindPicker</div>,
  EntityTypePicker: () => <div>EntityTypePicker</div>,
}));

describe('MobileBrandsPage', () => {
  it('renders the MobileBrandsPage with title', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <MobileBrandsPage />
      </ThemeProvider>,
    );

    expect(screen.getByText('Mobile Brands')).toBeInTheDocument();
  });

  it('includes hidden EntityKindPicker and EntityTypePicker', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <MobileBrandsPage />
      </ThemeProvider>,
    );

    expect(screen.getByText('EntityKindPicker')).toBeInTheDocument();
    expect(screen.getByText('EntityTypePicker')).toBeInTheDocument();
  });
});
