module.exports = (sequelize, DataTypes) => {
  const UserAddress = sequelize.define("UserAddress", {}, { underscored: true })

  UserAddress.associate = (models) => {
    UserAddress.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    })
    UserAddress.belongsTo(models.Address, {
      foreignKey: {
        name: "addressId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    })
  }

  return UserAddress
}
