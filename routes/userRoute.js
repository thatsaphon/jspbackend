const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

router.put("/")
router.get("/me", userController.protect, userController.me)

module.exports = router
