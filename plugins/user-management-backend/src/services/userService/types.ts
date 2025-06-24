export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface UserService {
  createUser(input: Omit<User, 'id'>): Promise<User>;
  getUsers(): Promise<{ users: User[] }>;
  getUser(id: number): Promise<User>;
  updateUser(id: number, input: Partial<Omit<User, 'id'>>): Promise<User>;
  deleteUser(id: number): Promise<number>;
}
