const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const salesController = require('../controllers/salesController')
const { uploadSlip } = require('../middlewares/uploadMiddleware')

router.get('/', userController.protect, salesController.getAllSales)
router.post('/', userController.protect, salesController.createSales)
router.post('/guest', salesController.createGuessSales)
router.get('/:id', userController.softProtect, salesController.getsalesById)
router.put('/:id', userController.protect, salesController.changeSalesStatus)
router.post(
  '/slip/:id',
  userController.protect,
  uploadSlip.single('image'),
  salesController.uploadSlip
)

module.exports = router
