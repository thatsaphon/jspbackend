module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    "CartItem",
    {
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["IN CART", "REMOVED", "SUBMIT TO ORDER"],
      },
    },
    { underscored: true }
  )

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    })
    CartItem.belongsTo(models.Product, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    })
  }

  return CartItem
}
