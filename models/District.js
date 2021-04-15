module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define(
    'District',
    {
      code: DataTypes.STRING,
      nameTh: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      provinceId: DataTypes.STRING
    },
    { underscored: true, timestamps: false }
  )
  return District
}
