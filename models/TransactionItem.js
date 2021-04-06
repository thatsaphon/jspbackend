module.exports = (sequelize, DataTypes) => {
  const TransactionItem = sequelize.define(
    "TransactionItem",
    {
      quantity: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      unitCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    { underscored: true }
  )

  TransactionItem.associate = (models) => {
    TransactionItem.belongsTo(models.Product, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    })
    TransactionItem.belongsTo(models.Transaction, {
      foreignKey: {
        name: "transactionId",
        allowNull: false,
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    })
  }

  return TransactionItem
}
