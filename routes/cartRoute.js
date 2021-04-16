const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')
const userController = require('../controllers/userController')

router.get('/user', userController.protect, cartController.getUserCart)
router.post('/user', userController.protect, cartController.addUserCart)
router.put('/user', userController.protect, cartController.removeUserCart)
router.delete('/user', userController.protect, cartController.removeAllUserCart)
router.get('/', cartController.getGuessCartToken)
router.post('/', cartController.findGuessCart, cartController.addGuessCart)
// router.post('/', cartController.findGuessCart, cartController.addItemGuestCart)
// router.delete(
//   '/',
//   cartController.findGuessCart,
//   cartController.removeItemGuestCart
// )

module.exports = router
