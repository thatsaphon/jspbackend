module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
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
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
    User.hasMany(models.UserAddress, {
      foreignKey: {
        name: "userId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
  }

  return User
}
