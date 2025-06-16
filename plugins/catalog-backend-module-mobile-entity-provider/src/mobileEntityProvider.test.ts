import { MobileEntityProvider } from './mobileEntityProvider';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';

describe('MobileEntityProvider', () => {
  const mockApplyMutation = jest.fn();
  const mockConnection: EntityProviderConnection = {
    applyMutation: mockApplyMutation,
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set connection and run on connect', async () => {
    const provider = new MobileEntityProvider('test-provider');
    const spyRun = jest.spyOn(provider as any, 'run');

    global.fetch = jest.fn().mockResolvedValue({
      json: async () => [],
    });

    await provider.connect(mockConnection);
    expect(spyRun).toHaveBeenCalled();
  });

  it('should throw error if run is called before connect', async () => {
    const provider = new MobileEntityProvider('test-provider');
    await expect(provider.run()).rejects.toThrow('Not initialized');
  });

  it('should fetch data and apply mutation', async () => {
    const mockApiResponse = [
      { id: 'item-1', name: 'Test item 1' },
      { id: 'item-2', name: 'Test item 2' },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      json: async () => mockApiResponse,
    });

    const provider = new MobileEntityProvider('test-provider');
    await provider.connect(mockConnection);

    expect(mockApplyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expect.arrayContaining([
        expect.objectContaining({
          entity: expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'item-1',
              description: 'Test item 1',
            }),
          }),
        }),
        expect.objectContaining({
          entity: expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'item-2',
              description: 'Test item 2',
            }),
          }),
        }),
      ]),
    });
  });

  it('should handle empty API response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => [],
    });

    const provider = new MobileEntityProvider('test-provider');
    await provider.connect(mockConnection);

    expect(mockApplyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [],
    });
  });

  it('should return provider name', async () => {
    const provider = new MobileEntityProvider('test-provider');
    expect(provider.getProviderName()).toEqual('test-provider');
  });
});
