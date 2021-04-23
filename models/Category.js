module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      code: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false }
    },
    { underscored: true }
  )

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: {
        name: 'categoryId'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
  }

  return Category
}
