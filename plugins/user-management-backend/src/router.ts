import express from 'express';
import Router from 'express-promise-router';
import { UserService } from './services/userService/types';

export async function createRouter({
  userService,
}: {
  userService: UserService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.post('/users', async (req, res) => {
    const result = await userService.createUser(req.body);
    res.status(200).json(result);
  });

  router.get('/users', async (_req, res) => {
    const result = await userService.getUsers();
    res.json(result);
  });

  router.get('/users/:id', async (req, res) => {
    const id = Number(req.params.id);
    const user = await userService.getUser(id);
    res.json(user);
  });

  router.put('/users/:id', async (req, res) => {
    const id = Number(req.params.id);
    const updatedUser = await userService.updateUser(id, req.body);
    res.json(updatedUser);
  });

  router.delete('/users/:id', async (req, res) => {
    const id = Number(req.params.id);
    await userService.deleteUser(id);
    res.status(204).send();
  });

  return router;
}
