import { prisma } from "../lib/prisma";

import express from 'express';

const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { name, email, cpf, phone, password } = req.body;

  const user = await prisma.user.create({
    data: { name, email, cpf, phone, password },
  });
  res.json(user);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});