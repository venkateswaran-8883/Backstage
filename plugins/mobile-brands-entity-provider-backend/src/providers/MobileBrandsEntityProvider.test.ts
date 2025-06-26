import { MobileBrandsEntityProvider } from './MobileBrandsEntityProvider';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import fetch from 'node-fetch';

jest.mock('node-fetch');
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('MobileBrandsEntityProvider', () => {
  const mockApplyMutation = jest.fn();
  const mockConnection: EntityProviderConnection = {
    applyMutation: mockApplyMutation,
    refresh: jest.fn(),
  };

  const mockApiResponse = [
    { id: '1', name: 'Samsung Galaxy' },
    { id: '2', name: 'Apple iPhone' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct provider name', () => {
    const provider = new MobileBrandsEntityProvider();
    expect(provider.getProviderName()).toBe('mobile-brands-entity-provider');
  });

  it('should fetch data and apply mutation on connect', async () => {
    mockedFetch.mockResolvedValue({
      json: async () => mockApiResponse,
    } as any);

    const provider = new MobileBrandsEntityProvider();
    await provider.connect(mockConnection);

    expect(mockedFetch).toHaveBeenCalledWith(
      'https://api.restful-api.dev/objects',
    );
    expect(mockApplyMutation).toHaveBeenCalledTimes(1);

    const appliedEntities = mockApplyMutation.mock.calls[0][0].entities;
    expect(appliedEntities).toHaveLength(2);
    expect(appliedEntities[0].entity.metadata.name).toBe('samsung-galaxy');
    expect(appliedEntities[1].entity.metadata.name).toBe('apple-iphone');
  });

  it('should throw an error if connection is not established', async () => {
    const provider = new MobileBrandsEntityProvider();
    await expect(provider.run()).rejects.toThrow(
      'EntityProviderConnection not established',
    );
  });
});
