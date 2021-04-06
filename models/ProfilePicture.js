module.exports = (sequelize, DataTypes) => {
  const ProfilePicture = sequelize.define(
    "ProfilePicture",
    {
      path: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    { underscored: true }
  )

  ProfilePicture.associate = (models) => {
    ProfilePicture.hasMany(models.User, {
      foreignKey: {
        name: "profilePictureId",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    })
  }

  return ProfilePicture
}
