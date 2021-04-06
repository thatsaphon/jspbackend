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
        values: ["ORDERS,CONFIRMED,PAYMENT_RECEIVED,IN_TRANSIT,RECEIVED"],
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
        name: "transactionId",
        allowNull: false,
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    })
    Transaction.hasMany(models.TransactionItem, {
      foreignKey: {
        name: "userId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
  }

  return Transaction
}
