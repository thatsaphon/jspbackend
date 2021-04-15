const express = require('express')
const router = express.Router()
const addressController = require('../controllers/addressController')

router.get('/province', addressController.getProvince)
router.get('/district/:province', addressController.getDistrict)
router.get('/subdistrict/:district', addressController.getSubDistrict)

module.exports = router
