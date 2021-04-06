const express = require("express")
const productController = require("../controllers/productController")
const userController = require("../controllers/userController")
const router = express.Router()

// router.get("/", productController.getAllProduct)
router.get("/", productController.getFilteredProduct)
router.get("/:id", productController.getProductById)
router.post("/", userController.protect, productController.createProduct)
router.put("/:id", userController.protect, productController.updateProduct)
router.delete("/:id", userController.protect, productController.deleteProduct)

module.exports = router
