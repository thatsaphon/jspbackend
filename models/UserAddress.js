module.exports = (sequelize, DataTypes) => {
  const UserAddress = sequelize.define("UserAddress", {}, { underscored: true })

  UserAddress.associate = (models) => {
    UserAddress.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
    UserAddress.belongsTo(models.Address, {
      foreignKey: {
        name: "addressId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
  }

  return UserAddress
}
