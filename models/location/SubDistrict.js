module.exports = (sequelize, DataTypes) => {
  const SubDistrict = sequelize.define(
    'SubDistrict',
    {
      id: DataTypes.STRING,
      zipCode: DataTypes.STRING,
      nameTh: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      districtId: DataTypes.STRING
    },
    { underscored: true, timestamps: false }
  )
  return SubDistrict
}
