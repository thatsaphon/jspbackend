module.exports = (sequelize, DataTypes) => {
  const ProfilePicture = sequelize.define(
    'ProfilePicture',
    {
      path: DataTypes.STRING,
      name: DataTypes.STRING,
      userId: DataTypes.STRING
    },
    { underscored: true }
  )

  ProfilePicture.associate = (models) => {
    ProfilePicture.hasMany(models.User, {
      foreignKey: {
        name: 'profilePictureId',
        defaultValue: 0
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
  }

  return ProfilePicture
}
