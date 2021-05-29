module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userType: {
        type: DataTypes.ENUM,
        values: ['ADMIN', 'USER'],
        defaultValue: 'USER'
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: DataTypes.STRING,
      phoneNumber: {
        type: DataTypes.STRING
        // allowNull: false
      },
      email: DataTypes.STRING,
      OAuthId: {
        type: DataTypes.STRING,
        field: 'oauth_id'
      }
    },
    { underscored: true }
  )

  User.associate = (models) => {
    User.belongsTo(models.ProfilePicture, {
      foreignKey: {
        name: 'profilePictureId',
        defaultValue: 1
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    User.hasMany(models.Transaction, {
      foreignKey: {
        name: 'userId'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    User.hasMany(models.UserAddress, {
      foreignKey: {
        name: 'userId'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    User.hasMany(models.CartItem, {
      foreignKey: {
        name: 'userId'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
  }

  return User
}
