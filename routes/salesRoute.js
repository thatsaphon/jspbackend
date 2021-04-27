const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const salesController = require('../controllers/salesController')

router.get('/', userController.protect, salesController.getAllSales)
router.post('/', userController.protect, salesController.createSales)
router.post('/guest', salesController.createGuessSales)
router.get('/:id', userController.softProtect, salesController.getsalesById)
router.put('/:id', userController.protect, salesController.changeSalesStatus)

module.exports = router
