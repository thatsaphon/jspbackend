const fs = require('fs')
const util = require('util')
const { CartItem, Product } = require('../models')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

// exports.findCart = async (req, res, next) => {
//   const data = await readFile("./carts.json", "utf8")
//   const carts = JSON.parse(data)
//   if (!req.headers.authorization) {
//     console.log(carts)
//     console.log(carts.carts[0])
//     const guestId = carts.carts[carts.carts.length - 1].cartId + 1
//     console.log(guestId)
//     const token = await jwt.sign({ cartId: guestId }, process.env.JWT_SECRET, {
//       expiresIn: +process.env.JWT_EXPIRES_IN,
//     })
//     const cart = { cartId: guestId, userId: 0, cart: [] }
//     carts.carts.push(cart)
//     await writeFile("./carts.json", JSON.stringify(carts))
//     console.log(carts)
//     req.cart = cart
//     req.carts = carts
//     // req.cartId = { cartId: guestId }
//     next()
//     // res.status(200).json({ token })
//   } else if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1]
//     const payload = jwt.verify(token, process.env.JWT_SECRET)

//     if (!payload.cartId) {
//       const idx = carts.carts.indexOf((item) => item.cartId === payload.cartId)
//       // console.log(payload.cartId)
//       // const data = await readFile("./carts.json", "utf8")
//       // const carts = JSON.parse(data)
//       // req.carts = carts
//       // req.cartId = { cartId: payload.Id }
//     }
//     // res.status(200).json({ message: "Continue shopping with existed guestId" })
//     // if (payload.userId) {
//     // }
//     next()
//   } else next()
// }

exports.findGuessCart = async (req, res, next) => {
  const data = await readFile('./carts.json', 'utf8')
  const carts = JSON.parse(data)
  // const { cart } = JSON.parse(req.headers.authorization)
  console.log(carts)
  if (!req.headers.authorization) {
    const cartId = carts.carts[carts.carts.length - 1].cartId + 1
    req.headers.authorization = { cartId: cartId, cart: [] }
    carts.carts.push(req.headers.authorization)
    await writeFile('./carts.json', JSON.stringify(carts))
    req.carts = carts
  }
  // const index = carts.carts.indexOf(
  //   (item) => item.cartId == +req.headers.authorization.cartId
  // )
  req.headers.authorization = JSON.parse(req.headers.authorization)
  const index = carts.carts.findIndex(
    (item) => item.cartId === +req.headers.authorization.cartId
  )
  console.log(carts.carts[4].cartId)
  console.log(req.headers.authorization.cartId)
  console.log('sssssssssssssss', index)
  req.carts = carts
  req.index = index
  // req.cart = cart
  // console.log(cart)
  next()
  // res.status(200).json({ cart })
  // if (req.headers.authorization) {
  //   carts.carts.indexOf(
  //     (item) => item.cartId === req.headers.authorization.cartId
  //   )
  // }
}

exports.getCart = async (req, res, next) => {
  // let cartId = req.cartId
  // if (!req.cartId) {
  //   req.cartId = req.carts.carts[carts.carts.length - 1].id + 1
  //   req.carts.carts.push({ id: req.cartId, user: req.user.id, cart: [] })
  // }
  const { cart } = req.headers.authorization
}

exports.addItemGuestCart = async (req, res, next) => {
  const { id, quantity, price } = req.body
  const idx = req.headers.authorization.cart.findIndex(
    (item) => item.productId === id
  )
  if (idx === -1)
    req.headers.authorization.cart.push({ productId: id, quantity, price })
  else cart[idx] = { productId: id, quantity, price }
  console.log(req.headers.authorization)
  req.carts.carts[req.index].cart.push({ productId: id, quantity, price })
  console.log(req.carts)
  await writeFile('./carts.json', JSON.stringify(req.carts))
  res.status(200).json({ cart: req.carts.carts })
}

exports.removeItemGuestCart = async (req, res, next) => {
  const { id, quantity, price } = req.body

  const idx = req.headers.authorization.cart.findIndex(
    (item) => item.productId === id
  )
  if (idx === -1)
    res.status(400).json({ message: 'this product is not in the cart' })
  req.headers.authorization.cart = req.headers.authorization.cart.filter(
    (item) => item.productId !== id
  )
  req.carts.carts[req.index].cart = req.carts.carts[req.index].cart.filter(
    (item) => item.productId !== id
  )

  // req.headers.authorization.cart.push({ productId: id, quantity, price })
  // else cart[idx] = { productId: id, quantity, price }
  console.log(req.headers.authorization)
  console.log(req.carts)
  await writeFile('./carts.json', JSON.stringify(req.carts))
  res.status(204).json()
}

exports.getUserCart = async (req, res, next) => {
  try {
    const cart = await CartItem.findAll({
      where: {
        userId: req.user.id,
        status: 'IN CART'
      },
      include: {
        model: Product,
        attributes: ['price', 'name', 'description', 'imgPath']
      }
    })
    res.status(200).json({ cart })
  } catch (err) {
    next(err)
  }
}

exports.addUserCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body
    const isProductExist = await Product.findOne({ where: { id: productId } })
    if (!isProductExist)
      res.status(400).json({ message: 'this product does not exist' })
    const isAlreadyInCart = await CartItem.findOne({
      where: {
        productId,
        userId: req.user.id,
        status: 'IN CART'
      }
    })
    const unitPrice = isProductExist.price
    // console.log(isAlreadyInCart)
    // console.log(unitPrice)
    if (isAlreadyInCart) {
      await isAlreadyInCart.update({ quantity, unitPrice })
      return res.status(200).json({ productId, quantity, unitPrice })
    }
    const cartItem = await CartItem.create({
      productId,
      quantity,
      unitPrice,
      userId: req.user.id,
      status: 'IN CART'
    })
    res.status(200).json({ productId, quantity, unitPrice })
  } catch (err) {
    next(err)
  }
}

exports.removeUserCart = async (req, res, next) => {
  const { productId } = req.body
  const isAlreadyInCart = await CartItem.findOne({
    where: {
      productId,
      userId: req.user.id,
      status: 'IN CART'
    }
  })
  if (!isAlreadyInCart)
    return res.status(400).json({ message: 'this product is not in your cart' })
  await isAlreadyInCart.update({ status: 'REMOVED' })
  res.status(204).json()
}
