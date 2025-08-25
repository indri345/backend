import express from 'express';
import dotenv from 'dotenv';
import { sequelize, Role } from './src/models/index.js';
import authRoutes from './src/routes/auth.js';
import sampleRoutes from './src/routes/sample.js';
import adminPlantsRoutes from './src/routes/admin.plants.js';
import farmerPlantsRoutes from './src/routes/farmer.plants.js';
import careRoutes from './src/routes/care.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', sampleRoutes);
app.use('/admin/plants', adminPlantsRoutes);
app.use('/farmer/plants', farmerPlantsRoutes);
app.use('/care', careRoutes);

app.get('/', (_, res) => res.json({ status: 'ok' }));

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); 

    const roles = ['admin', 'agronomist', 'farmer'];
    for (const name of roles) {
      await Role.findOrCreate({ where: { name }, defaults: { name } });
    }

    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`API running on :${port}`));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

start();
