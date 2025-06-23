import { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';

import { Page, Header, Content } from '@backstage/core-components';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
}

export const UserComponent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<User>({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [editUser, setEditUser] = useState<User | null>(null);

  const identityApi = useApi(identityApiRef);

  const fetchUsers = async () => {
    const { token } = await identityApi.getCredentials();

    const res = await fetch('http://localhost:7007/api/user-management/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUsers(data.users);
  };

  useEffect(() => {
    fetchUsers();
  });

  const handleCreate = async () => {
    const { token } = await identityApi.getCredentials();

    await fetch('http://localhost:7007/api/user-management/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    setForm({ first_name: '', last_name: '', email: '' });
    fetchUsers();
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const { token } = await identityApi.getCredentials();

    await fetch(`http://localhost:7007/api/user-management/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchUsers();
  };

  const handleUpdate = async () => {
    if (!editUser?.id) return;
    const { token } = await identityApi.getCredentials();
    await fetch(
      `http://localhost:7007/api/user-management/users/${editUser.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editUser),
      },
    );
    setEditUser(null);
    fetchUsers();
  };

  return (
    <Page themeId="tool">
      <Header title="User Management" />
      <Content>
        <h3>Create User</h3>

        <Box display="flex" flexWrap="wrap" style={{ marginBottom: 16 }}>
          <TextField
            label="First Name"
            value={form.first_name}
            onChange={e => setForm({ ...form, first_name: e.target.value })}
            style={{ marginRight: 16 }}
          />
          <TextField
            label="Last Name"
            value={form.last_name}
            onChange={e => setForm({ ...form, last_name: e.target.value })}
            style={{ marginRight: 16 }}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ marginRight: 16 }}
          />
          <Button onClick={handleCreate} color="primary" variant="contained">
            Create
          </Button>
        </Box>

        <h3>User List</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button onClick={() => setEditUser(user)}>Edit</Button>
                  <Button
                    onClick={() => handleDelete(user.id)}
                    color="secondary"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="First Name"
              value={editUser?.first_name || ''}
              onChange={e =>
                setEditUser({ ...editUser!, first_name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Last Name"
              value={editUser?.last_name || ''}
              onChange={e =>
                setEditUser({ ...editUser!, last_name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Email"
              value={editUser?.email || ''}
              onChange={e =>
                setEditUser({ ...editUser!, email: e.target.value })
              }
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleUpdate} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
    </Page>
  );
};
