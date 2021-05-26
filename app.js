require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const { errorMiddleware } = require('./middlewares/errorMiddleware')
const productRoute = require('./routes/productRoute')
const userRoute = require('./routes/userRoute')
const cartRoute = require('./routes/cartRoute')
const salesRoute = require('./routes/salesRoute')
const purchaseRoute = require('./routes/purchaseRoute')
const { sequelize } = require('./models')
const userController = require('./controllers/userController')
const cartController = require('./controllers/cartController')
const locationRoute = require('./routes/loactionRoute')
const { upload } = require('./middlewares/uploadMiddleware')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use('/product', upload.single('image'), productRoute)

app.get('/guest', cartController.findGuessCart)

app.post('/register', userController.register)
app.post('/login', userController.login)

app.use('/order', salesRoute)
app.use('/purchase', purchaseRoute)
app.use('/cart', cartRoute)
app.use('/product', productRoute)
app.use('/user', userRoute)
app.use('/location', locationRoute)

app.use('/', (req, res, next) => {
  res.status(400).json({ message: 'path not found' })
})

app.use(errorMiddleware)

// sequelize.sync({ alter: true })
const port = 8000
app.listen(port, (req, res, next) => {
  console.log(`Server running on port ${port}`)
})
