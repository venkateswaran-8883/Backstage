import { userManagementPlugin } from './plugin';

describe('user-management', () => {
  it('should export plugin', () => {
    expect(userManagementPlugin).toBeDefined();
  });
});
