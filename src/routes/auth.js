import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role, User } from '../models/index.js';
import { validate } from '../utils/validate.js';

const router = Router();

const ROLES = ['admin', 'agronomist', 'farmer'];

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    validate(
      { username, email, password, role },
      {
        username: 'required|string|min:3|max:100',
        email: 'required|email',
        password: 'required|string|min:8|max:100',
        role: 'string|in:admin,agronomist,farmer'
      }
    );

    const roleName = role && ROLES.includes(role) ? role : 'farmer';

    const roleRow = await Role.findOne({ where: { name: roleName } });
    if (!roleRow) return res.status(500).json({ message: 'Role seed missing' });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      email,
      password: hashed,
      role_id: roleRow.id,
      role: roleRow.name
    });

    const { password: _p, ...data } = user.toJSON();
    return res.status(201).json({ user: data });
  } catch (e) {
    const code = e.status || 400;
    return res.status(code).json({ message: e.message || 'Bad Request' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    validate({ username, password }, {
      username: 'required|string',
      password: 'required|string'
    });

    const user = await User.findOne({ where: { username }, include: [{ model: Role, as: 'roleRef' }] });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role || user.roleRef?.name,
      role_id: user.role_id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || '1d'
    });

    return res.json({ token, user: { id: user.id, username: user.username, role: payload.role } });
  } catch (e) {
    return res.status(400).json({ message: e.message || 'Bad Request' });
  }
});

export default router;
