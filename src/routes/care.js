import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { Care, Plant } from '../models/index.js';
import { validate } from '../utils/validate.js';
import { Op } from 'sequelize';

const router = Router();

const ensureOwnership = async (farmerId, plantId) => {
  const plant = await Plant.findByPk(plantId);
  if (!plant) {
    const err = new Error('Plant not found');
    err.status = 404;
    throw err;
  }
  if (plant.owner_id !== farmerId) {
    const err = new Error('Forbidden: Plant not owned by you');
    err.status = 403;
    throw err;
  }
  return plant;
};

router.post('/', auth, authorize(['farmer', 'admin']), async (req, res) => {
  try {
    const { plant_id, start_date, last_date, fertilizer_type, notes } = req.body;
    validate({ plant_id, start_date, last_date, fertilizer_type, notes }, {
      plant_id: 'required|integer',
      start_date: 'required|date',
      last_date: 'date',
      fertilizer_type: 'string|max:100',
      notes: 'string'
    });

    if (req.user.role === 'farmer') {
      await ensureOwnership(req.user.id, plant_id);
    }

    const care = await Care.create({
      plant_id,
      farmer_id: req.user.role === 'admin' ? null : req.user.id, // admin boleh isi null / atau tentukan farmer_id
      start_date,
      last_date: last_date || null,
      fertilizer_type: fertilizer_type || null,
      notes: notes || null
    });

    res.status(201).json({ care });
  } catch (e) { res.status(e.status || 400).json({ message: e.message }); }
});


router.get('/', auth, authorize(['farmer', 'admin']), async (req, res) => {
  if (req.user.role === 'admin') {
    const cares = await Care.findAll({ order: [['id', 'ASC']] });
    return res.json({ cares });
  }

  const cares = await Care.findAll({
    where: { [Op.or]: [{ farmer_id: req.user.id }] },
    order: [['id', 'ASC']]
  });
  res.json({ cares });
});


router.get('/:id', auth, authorize(['farmer', 'admin']), async (req, res) => {
  const care = await Care.findByPk(req.params.id);
  if (!care) return res.status(404).json({ message: 'Care not found' });

  if (req.user.role === 'farmer') {
    await ensureOwnership(req.user.id, care.plant_id);
    if (care.farmer_id && care.farmer_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  }

  res.json({ care });
});

router.put('/:id', auth, authorize(['farmer', 'admin']), async (req, res) => {
  try {
    const { start_date, last_date, fertilizer_type, notes } = req.body;
    validate({ start_date, last_date, fertilizer_type, notes }, {
      start_date: 'date',
      last_date: 'date',
      fertilizer_type: 'string|max:100',
      notes: 'string'
    });

    const care = await Care.findByPk(req.params.id);
    if (!care) return res.status(404).json({ message: 'Care not found' });

    if (req.user.role === 'farmer') {
      await ensureOwnership(req.user.id, care.plant_id);
      if (care.farmer_id && care.farmer_id !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    await care.update({
      start_date: start_date ?? care.start_date,
      last_date: last_date ?? care.last_date,
      fertilizer_type: fertilizer_type ?? care.fertilizer_type,
      notes: notes ?? care.notes
    });

    res.json({ care });
  } catch (e) { res.status(e.status || 400).json({ message: e.message }); }
});

router.delete('/:id', auth, authorize(['farmer', 'admin']), async (req, res) => {
  const care = await Care.findByPk(req.params.id);
  if (!care) return res.status(404).json({ message: 'Care not found' });

  if (req.user.role === 'farmer') {
    await ensureOwnership(req.user.id, care.plant_id);
    if (care.farmer_id && care.farmer_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  }

  await care.destroy();
  res.json({ message: 'Deleted' });
});

export default router;
