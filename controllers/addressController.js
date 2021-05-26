const { Province, District, SubDistrict } = require('../models')

exports.getProvince = async (req, res, next) => {
  try {
    const provinces = await Province.findAll()
    res.status(200).json({ provinces })
  } catch (err) {
    next(err)
  }
}

exports.getDistrict = async (req, res, next) => {
  try {
    const { province } = req.params
    const provinces = await Province.findOne({ where: { nameTh: province } })
    const districts = await District.findAll({
      where: { provinceId: provinces.id }
    })
    res.status(200).json({ districts })
  } catch (err) {
    next(err)
  }
}

exports.getSubDistrict = async (req, res, next) => {
  try {
    const { district } = req.params
    const districts = await District.findOne({ where: { nameTh: district } })
    const subDistricts = await SubDistrict.findAll({
      where: { districtId: districts.id }
    })
    console.log(subDistricts)
    res.status(200).json({ subDistricts })
  } catch (err) {
    next(err)
  }
}
