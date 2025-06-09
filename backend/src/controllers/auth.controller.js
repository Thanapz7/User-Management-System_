const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!role) {
    return res.status(400).json({ error: 'Role is required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const roleRecord = await prisma.role.findUnique({
      where: { name: role }
    });

    if (!roleRecord) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: {
          connect: { id: roleRecord.id }
        }
      }
    });

    res.json({ message: 'User registered', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.cookie('user', JSON.stringify({ id: user.id, role: user.role?.name, email: user.email, name: user.name, createAt: user.createdAt }), {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    message: 'Login successful',
    user: { id: user.id, name: user.name, role: user.role?.name },
  });
};

exports.getMe = (req, res) => {
  const userCookie = req.cookies.user;
  if (!userCookie) return res.status(401).json({ error: 'Not logged in' });

  try {
    const user = JSON.parse(userCookie);
    res.json({ user });
  } catch {
    res.status(400).json({ error: 'Invalid session' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('user');
  res.json({ message: 'Logged out' });
};
