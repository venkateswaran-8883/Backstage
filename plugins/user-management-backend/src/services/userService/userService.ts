import { LoggerService } from '@backstage/backend-plugin-api';
import { NotFoundError, InputError } from '@backstage/errors';
import { z } from 'zod';
import { User, UserService } from './types';
import knex from 'knex';

export async function createUserService({
  logger,
  database,
}: {
  logger: LoggerService;
  database: knex.Knex;
}): Promise<UserService> {
  logger.info('Initializing UserService');

  const exists = await database.schema.hasTable('users');
  if (!exists) {
    logger.warn('table not exist, creating new one');
    await database.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('email').notNullable();
    });
    logger.info('table created in database');
  }
  const userSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
  });

  return {
    async createUser(input): Promise<User> {
      const schemaValidation = userSchema.safeParse(input);
      if (schemaValidation.error) {
        logger.error(
          `schema validation error ${schemaValidation.error.message}`,
        );
        throw new InputError(schemaValidation.error.toString());
      }
      const userExist = await database<User>('users')
        .where({ email: input.email })
        .first();

      if (userExist) {
        logger.error(`user exist with email '${input.email}'`);
        throw new InputError(`user exist with email ${input.email}`);
      }

      const res = await database<User>('users').insert(input);
      logger.info(`user created with ID ${res[0]}`);
      return { ...input, id: res[0] };
    },

    async getUsers(): Promise<{ users: User[] }> {
      const userList = await database<User>('users').select('*');
      return { users: userList };
    },

    async getUser(id: number): Promise<User> {
      const data = await database<User>('users').where({ id }).first();
      if (!data) {
        logger.error(`user not exist with id ${id}`);
        throw new NotFoundError(`user not exist with id ${id}`);
      }
      return data;
    },

    async updateUser(
      id: number,
      input: Partial<Omit<User, 'id'>>,
    ): Promise<User> {
      const schemaValidation = userSchema.partial().safeParse(input);
      if (schemaValidation.error) {
        throw new InputError(schemaValidation.error.toString());
      }
      const existing = await database<User>('users').where({ id }).first();
      if (!existing) {
        logger.error(`user not exist with id ${id}`);
        throw new NotFoundError(`user not exist with id ${id}`);
      }
      const updated = {...input,...existing}
      await database<User>('users').where({ id }).update(input)
      logger.info(`user updated with ID ${id}`);
      return updated;
    },

    async deleteUser(id: number): Promise<number> {
      const deleted = await database<User>('users').where({ id }).del();
      if (!deleted) {
        logger.error(`user not exist with id '${id}'`);
        throw new NotFoundError(`user not exist with id '${id}'`);
      }
      logger.info(`user deleted with ID ${id}`);
      return deleted;
    },
  };
}
