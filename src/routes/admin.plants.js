import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { Plant } from '../models/index.js';
import { validate } from '../utils/validate.js';

const router = Router();


router.post('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const { name, species, location } = req.body;
    validate({ name, species, location }, {
      name: 'required|string|min:2|max:100',
      species: 'required|string|min:2|max:100',
      location: 'required|string|min:2|max:100'
    });

    const plant = await Plant.create({ name, species, location, owner_id: null, planted_at: null });
    res.status(201).json({ plant });
  } catch (e) { res.status(400).json({ message: e.message }); }
});


router.get('/', auth, authorize(['admin']), async (_req, res) => {
  const plants = await Plant.findAll({ order: [['id', 'ASC']] });
  res.json({ plants });
});


router.get('/:id', auth, authorize(['admin']), async (req, res) => {
  const plant = await Plant.findByPk(req.params.id);
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  res.json({ plant });
});


router.put('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const { name, species, location } = req.body;
    validate({ name, species, location }, {
      name: 'required|string|min:2|max:100',
      species: 'required|string|min:2|max:100',
      location: 'required|string|min:2|max:100'
    });

    const plant = await Plant.findByPk(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });

    await plant.update({ name, species, location });
    res.json({ plant });
  } catch (e) { res.status(400).json({ message: e.message }); }
});


router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  const plant = await Plant.findByPk(req.params.id);
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  await plant.destroy();
  res.json({ message: 'Deleted' });
});

export default router;
