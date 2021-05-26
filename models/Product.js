module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: DataTypes.STRING,
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      averageCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      lastPurchaseCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      imgPath: DataTypes.STRING
    },
    { underscored: true }
  )
  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: {
        name: 'categoryId',
        defaultValue: 0
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Product.hasMany(models.TransactionItem, {
      foreignKey: {
        name: 'productId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Product.hasMany(models.CartItem, {
      foreignKey: {
        name: 'productId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Product.hasMany(models.ProductImage, {
      foreignKey: {
        name: 'productId'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
  }

  return Product
}
