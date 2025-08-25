import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { Plant } from '../models/index.js';
import { validate } from '../utils/validate.js';

const router = Router();


router.get('/available', auth, authorize(['farmer']), async (_req, res) => {
  const plants = await Plant.findAll({ where: { owner_id: null }, order: [['id', 'ASC']] });
  res.json({ plants });
});


router.get('/mine', auth, authorize(['farmer']), async (req, res) => {
  const plants = await Plant.findAll({ where: { owner_id: req.user.id }, order: [['id', 'ASC']] });
  res.json({ plants });
});


router.post('/:id/claim', auth, authorize(['farmer']), async (req, res) => {
  try {
    const { planted_at } = req.body;
    validate({ planted_at }, {
      planted_at: 'required|date'
    });

    const plant = await Plant.findByPk(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    if (plant.owner_id) return res.status(409).json({ message: 'Plant already owned' });

    await plant.update({ owner_id: req.user.id, planted_at });
    res.json({ plant });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

export default router;
