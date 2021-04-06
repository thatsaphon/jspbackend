module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: DataTypes.STRING,
    },
    { underscored: true }
  )

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: {
        name: "categoryId",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    })
  }

  return Category
}