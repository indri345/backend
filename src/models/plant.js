import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Plant extends Model {}

  Plant.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      species: { type: DataTypes.STRING(100), allowNull: false },
      location: { type: DataTypes.STRING(100), allowNull: false },

      owner_id: { type: DataTypes.INTEGER, allowNull: true },
      planted_at: { type: DataTypes.DATEONLY, allowNull: true }
    },
    {
      sequelize,
      modelName: 'Plant',
      tableName: 'plants',
      timestamps: true
    }
  );

  return Plant;
};
