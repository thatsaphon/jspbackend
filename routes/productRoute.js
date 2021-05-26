const express = require('express')
const productController = require('../controllers/productController')
const userController = require('../controllers/userController')
const router = express.Router()
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const uploadMiddleware = require('../middlewares/uploadMiddleware')

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log(file)
//     cb(null, 'public/product/image')
//   },
//   filename: (req, file, cb) => {
//     cb(null, 'product-' + Date.now() + '.' + file.mimetype.split('/')[1])
//   }
// })
// const upload = multer(
//   { storage },
//   {
//     fileFilter: (req, file, cb) => {
//       if (
//         file.mimetype.split('/')[1] === 'jpeg' ||
//         file.mimetype.split('/')[1] === 'jpg' ||
//         file.mimetype.split('/')[1] === 'png'
//       )
//         cb(null, true)
//       else {
//         cb(new Error('this file is not a photo'))
//       }
//     }
//   }
// )

// router.get("/", productController.getAllProduct)
router.post(
  '/upload',
  uploadMiddleware.upload.single('image'),
  productController.uploadProduct
)
router.post(
  '/category',
  userController.protect,
  productController.createCategory
)
router.get('/category', productController.getCategoryList)
router.get('/', productController.getFilteredProduct)
router.get('/:id', productController.getProductById)
router.post(
  '/image/:productId',
  uploadMiddleware.upload.single('image'),
  userController.protect,
  productController.addImageByProductId
)
router.post('/', userController.protect, productController.createProduct)
router.put('/:id', userController.protect, productController.updateProduct)
router.delete(
  '/image/:id',
  userController.protect,
  productController.deleteImage
)
router.delete('/:id', userController.protect, productController.deleteProduct)

module.exports = router
