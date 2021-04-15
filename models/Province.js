module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define(
    'Province',
    {
      code: DataTypes.STRING,
      nameTh: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      geographyId: DataTypes.STRING
    },
    { underscored: true, timestamps: false }
  )
  return Province
}
