const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { upload } = require('../middlewares/uploadMiddleware')

router.put('/')
router.get('/me', userController.protect, userController.me)
router.post(
  '/picture',
  userController.protect,
  upload.single('image'),
  userController.changeProfilePicture
)
router.delete(
  '/picture',
  userController.protect,
  userController.deleteProfilePicture
)

module.exports = router
