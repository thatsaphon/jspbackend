module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
    {
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subDistrict: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { underscored: true }
  )

  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
  }

  return Address
}
