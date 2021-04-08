module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      type: {
        type: DataTypes.ENUM,
        values: ["PURCHASE", "SALES"],
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: [
          "ORDERS",
          "CONFIRMED",
          "CANCELLED",
          "PAYMENT_RECEIVED",
          "IN_TRANSIT,RECEIVED",
        ],
        allowNull: false,
      },
      address: DataTypes.STRING,
      firstName: DataTypes.STRING,
      surName: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    { underscored: true }
  )

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    })
    Transaction.hasMany(models.TransactionItem, {
      foreignKey: {
        name: "transactionId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    })
  }

  return Transaction
}
