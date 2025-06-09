const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    include: { role: true },
  });
  res.json(users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role?.name,
    createdAt: user.createdAt
  })));
};

exports.createUser = async (req, res) => {
  const { name, email, password, roleName } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    if (!roleName) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const roleRecord = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!roleRecord) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: {
          connect: { id: roleRecord.id },
        },
      },
      include: {
        role: true 
      }
    });

    res.json({
      message: 'User created',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, roleName } = req.body;

  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  let roleId;
  if (roleName) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) return res.status(400).json({ error: 'Invalid role' });
    roleId = role.id;
  }

  const data = {
    name,
    email,
    ...(roleId && { role: { connect: { id: roleId } } }),
  };

  if (password && password.trim() !== '') {
    data.password = await bcrypt.hash(password, 10);
  }

  const updated = await prisma.user.update({
    where: { id: Number(id) },
    data,
    include: {
      role: true
    }
  });

  res.json({
    message: 'User updated',
    updated: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role.name,
      createdAt: updated.createdAt
    }
  });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.json({ message: 'User deleted' });
};
