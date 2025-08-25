import sequelize from '../config/db.js';
import RoleFactory from './role.js';
import UserFactory from './user.js';
import PlantFactory from './plant.js';
import CareFactory from './care.js';

const Role = RoleFactory(sequelize);
const User = UserFactory(sequelize);
const Plant = PlantFactory(sequelize);
const Care = CareFactory(sequelize);

// relations
User.belongsTo(Role, { foreignKey: 'role_id', as: 'roleRef' });
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

Plant.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasMany(Plant, { foreignKey: 'owner_id', as: 'plants' });

Care.belongsTo(Plant, { foreignKey: 'plant_id', as: 'plant' });
Plant.hasMany(Care, { foreignKey: 'plant_id', as: 'cares' });

Care.belongsTo(User, { foreignKey: 'farmer_id', as: 'farmer' });
User.hasMany(Care, { foreignKey: 'farmer_id', as: 'cares' });

export { sequelize, Role, User, Plant, Care };
