import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Care extends Model {}

  Care.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      plant_id: { type: DataTypes.INTEGER, allowNull: false },
      farmer_id: { type: DataTypes.INTEGER, allowNull: false },
      start_date: { type: DataTypes.DATEONLY, allowNull: false },
      last_date: { type: DataTypes.DATEONLY, allowNull: true },
      fertilizer_type: { type: DataTypes.STRING(100), allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true }
    },
    {
      sequelize,
      modelName: 'Care',
      tableName: 'cares',
      timestamps: true
    }
  );

  return Care;
};
