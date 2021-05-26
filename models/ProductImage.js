module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define(
    'ProductImage',
    {
      imgPath: DataTypes.STRING
    },
    { underscored: true }
  )

  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
  }

  return ProductImage
}
