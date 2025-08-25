import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Role extends Model {}

  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        validate: { notEmpty: true }
      }
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      timestamps: false
    }
  );

  return Role;
};
