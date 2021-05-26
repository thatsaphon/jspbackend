const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const purchaseController = require('../controllers/purchaseController')
const { uploadSlip } = require('../middlewares/uploadMiddleware')

router.post('/:productId', purchaseController.purchaseById)
router.post('/', purchaseController.purchase)

module.exports = router
