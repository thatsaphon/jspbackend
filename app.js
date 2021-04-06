const express = require("express")
const app = express()
const cors = require("cors")
const { errorMiddleware } = require("./middlewares/errorMiddleware")
const productRoute = require("./routes/productRoute")
const { sequelize } = require("./models")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/product", productRoute)

app.use("/", (req, res, next) => {
  res.status(400).json({ message: "path not found" })
})

app.use(errorMiddleware)

// sequelize.sync({ force: true })

const port = 8000
app.listen((req, res, next) => {
  console.log(`Server running on port ${port}`)
})

// sql = ''
