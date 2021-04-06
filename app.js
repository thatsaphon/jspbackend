require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const { errorMiddleware } = require("./middlewares/errorMiddleware")
const productRoute = require("./routes/productRoute")
const userRoute = require("./routes/userRoute")
const { sequelize } = require("./models")
const userController = require("./controllers/userController")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/guest", userController.guest)

app.post("/register", userController.register)
app.post("/login", userController.login)

app.use("/product", productRoute)
app.use("/user", userRoute)

app.use("/", (req, res, next) => {
  res.status(400).json({ message: "path not found" })
})

app.use(errorMiddleware)

// sequelize.sync({ force: true })

const port = 8000
app.listen(port, (req, res, next) => {
  console.log(`Server running on port ${port}`)
})
