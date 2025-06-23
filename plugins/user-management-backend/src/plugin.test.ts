import {
  mockCredentials,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { userManagementPlugin } from './plugin';
import request from 'supertest';
import { Server } from 'http';

let server: Server;
beforeAll(async () => {
  const backend = await startTestBackend({
    features: [userManagementPlugin],
  });
  server = backend.server;
});

describe('plugin', () => {
  it('should create a user', async () => {
    const mockInput = {
      first_name: 'umapathi',
      last_name: 'pawar s',
      email: 'umapathi.pawars@cognizant.com',
    };

    const response = await request(server)
      .post('/api/user-management/users')
      .send(mockInput);
    expect(response.status).toBe(200);
  });
  it('should fail to create user if email is already registered', async () => {
    const mockInput = {
      first_name: 'umapathi',
      last_name: 'pawar s',
      email: 'umapathi.pawars@cognizant.com',
    };

    const response = await request(server)
      .post('/api/user-management/users')
      .send(mockInput);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
  it('should return validation error when required fields are missing', async () => {
    const mockInput = {
      first_name: 'umapathi',
      last_name: 'pawar s',
    };

    const response = await request(server)
      .post('/api/user-management/users')
      .send(mockInput);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
  it('should return list of users', async () => {
    const response = await request(server).get('/api/user-management/users');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('users');
  });
  it('should return user details for valid ID', async () => {
    const response = await request(server).get('/api/user-management/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email');
  });
  it('should return error when user ID is not found', async () => {
    const response = await request(server).get('/api/user-management/users/3');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
  it('should successfully update user by ID', async () => {
    const mockInput = {
      first_name: 'umapathi',
      last_name: 'pawar s',
    };
    const response = await request(server)
      .put('/api/user-management/users/1')
      .send(mockInput);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
  it('should return error when user ID is not found for update operation', async () => {
    const mockInput = {
      first_name: 'umapathi',
      last_name: 'pawar s',
    };
    const response = await request(server)
      .put('/api/user-management/users/3')
      .send(mockInput);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
  it('should give error for wrong req data', async () => {
    const mockInput = {
      email: 'abc',
    };
    const response = await request(server)
      .put('/api/user-management/users/1')
      .send(mockInput);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
  it('should return validation error for incorrect input', async () => {
    const response = await request(server).delete(
      '/api/user-management/users/1',
    );
    expect(response.status).toBe(204);
  });
  it('should return error when user ID is not found for delete operation', async () => {
    const response = await request(server).delete(
      '/api/user-management/users/3',
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});
