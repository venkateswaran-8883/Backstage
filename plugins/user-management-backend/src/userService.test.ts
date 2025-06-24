import { createUserService } from './services/userService';
import { mockServices } from '@backstage/backend-test-utils';
import { InputError, NotFoundError } from '@backstage/errors';
import { UserService } from './services/userService/types';

const mockKnex = {
  schema: {
    hasTable: jest.fn().mockResolvedValue(false),
    createTable: jest.fn().mockResolvedValue(true),
  },
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  del: jest.fn(),
};

const mockLogger = mockServices.logger.mock();
const mockDb = jest.fn(() => mockKnex) as any;
Object.assign(mockDb, mockKnex);

let service: UserService;
beforeAll(async () => {
  service = await createUserService({
    logger: mockLogger,
    database: mockDb,
  });
});

const validData = {
  first_name: 'umapathi',
  last_name: 'pawar',
  email: 'umapathi@test.com',
};
const invalidData = {
  first_name: 'umapathi',
  last_name: 'pawar',
  email: 'umapathi',
};
const responseData = [
  {
    first_name: 'umapathi',
    last_name: 'pawar',
    email: 'umapathi@test.com',
  },
];

const id = 1;

describe('createUser', () => {
  it('should create a user', async () => {
    mockKnex.first.mockResolvedValue(undefined);
    mockKnex.insert.mockResolvedValue([id]);
    const user = await service.createUser(validData);
    expect(mockDb.where).toHaveBeenCalledWith({ email: validData.email });
    expect(user).toEqual({
      id,
      ...validData,
    });
  });
  it('should throw validation error', async () => {
    mockKnex.first.mockResolvedValue({ user: 'sdds' });
    await expect(service.createUser(invalidData)).rejects.toThrow(InputError);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('schema validation error'),
    );
  });
  it('should throw user exits error', async () => {
    mockKnex.first.mockResolvedValue({ data: 'test' });
    await expect(service.createUser(validData)).rejects.toThrow(InputError);
    await expect(service.createUser(validData)).rejects.toThrow(
      `user exist with email ${validData.email}`,
    );
  });
});
describe('getUser', () => {
  it('should create a user', async () => {
    mockKnex.first.mockResolvedValue({ ...responseData[0], id });
    const user = await service.getUser(id);
    expect(mockDb.where).toHaveBeenCalledWith({ id });
    expect(user).toEqual({ ...responseData[0], id });
  });

  it('should throw user not exits error', async () => {
    mockKnex.first.mockResolvedValue(null);
    await expect(service.getUser(id)).rejects.toThrow(NotFoundError);
    await expect(service.getUser(id)).rejects.toThrow(
      `user not exist with id ${id}`,
    );
  });
});

describe('updateUser', () => {
  it('should create a user', async () => {
    mockKnex.first.mockResolvedValue({ ...responseData[0], id });
    mockKnex.update.mockResolvedValue(true);
    const updatedUser = await service.updateUser(id, validData);
    expect(mockDb.where).toHaveBeenCalledWith({ id });
    expect(mockDb.update).toHaveBeenCalledWith({ ...validData, id });
    expect(updatedUser).toEqual({ ...responseData[0], id });
  });
  it('should throw validation error', async () => {
    mockKnex.first.mockResolvedValue({ user: 'sdds' });
    await expect(service.updateUser(id, invalidData)).rejects.toThrow(
      InputError,
    );
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('schema validation error'),
    );
  });
  it('should throw user not exits error', async () => {
    mockKnex.first.mockResolvedValue(null);
    await expect(service.updateUser(id, validData)).rejects.toThrow(
      NotFoundError,
    );
    await expect(service.updateUser(id, validData)).rejects.toThrow(
      `user not exist with id ${id}`,
    );
  });
});
