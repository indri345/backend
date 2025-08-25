import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = Router();

router.get('/farmer/plants', auth, authorize(['farmer']), async (req, res) => {
  return res.json({ message: `Plants list for farmer ${req.user.username}` });
});

router.get('/agronomist/diagnosis', auth, authorize(['agronomist']), async (req, res) => {
  return res.json({ message: `Diagnosis tools for agronomist ${req.user.username}` });
});

router.get('/admin/users', auth, authorize(['admin']), async (req, res) => {
  return res.json({ message: `Admin can see all users` });
});

export default router;
