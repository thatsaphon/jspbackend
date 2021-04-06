module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userType: {
        type: DataTypes.ENUM,
        values: ["ADMIN", "USER"],
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: DataTypes.STRING,
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: DataTypes.STRING,
      postCode: DataTypes.STRING,
    },
    { underscored: true }
  )

  User.associate = (models) => {
    User.belongsTo(models.ProfilePicture, {
      foreignKey: {
        name: "profilePictureId",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    })
    User.hasMany(models.Transaction, {
      foreignKey: {
        name: "userId",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    })
    User.hasMany(models.Address, {
      foreignKey: {
        name: "userId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
  }

  return User
}
