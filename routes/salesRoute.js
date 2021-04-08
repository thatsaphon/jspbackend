const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const salesController = require("../controllers/salesController")

router.get("/", userController.protect, salesController.getAllSales)
router.post("/", userController.protect, salesController.createSales)
router.get("/:id", userController.protect, salesController.getsalesById)
router.put("/:id", userController.protect, salesController.changeSalesStatus)

module.exports = router
