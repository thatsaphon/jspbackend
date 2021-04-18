const fs = require('fs')
const util = require('util')
const { CartItem, Product } = require('../models')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

exports.findGuessCart = async (req, res, next) => {
  try {
    const data = await readFile('./carts.json', 'utf8')
    const carts = JSON.parse(data)
    if (!req.headers.authorization) {
      const cartId = carts.carts[carts.carts.length - 1].cartId + 1
      req.headers.authorization = { cartId: cartId, cartItem: [] }
      carts.carts.push(req.headers.authorization)
      await writeFile('./carts.json', JSON.stringify(carts))
      req.carts = carts
    }
    req.headers.authorization = JSON.parse(req.headers.authorization)
    const index = carts.carts.findIndex(
      (item) => item.cartId === +req.headers.authorization.cartId
    )
    req.carts = carts
    req.index = index
    next()
  } catch (err) {
    next(err)
  }
}

exports.getGuessCartToken = async (req, res, next) => {
  try {
    const data = await readFile('./carts.json', 'utf8')
    const carts = JSON.parse(data)
    if (!req.headers.authorization) {
      const cartId = carts.carts[carts.carts.length - 1].cartId + 1
      req.headers.authorization = { cartId: cartId, cartItem: [] }
      carts.carts.push(req.headers.authorization)
      await writeFile('./carts.json', JSON.stringify(carts))
      req.carts = carts
      // req.headers.authorization = JSON.parse(req.headers.authorization)
      console.log(req.headers.authorization)
      const index = carts.carts.findIndex(
        (item) => item.cartId === +req.headers.authorization.cartId
      )
      const token = `${JSON.stringify(req.headers.authorization)}`
      const cart = req.headers.authorization.cartItem
      req.carts = carts
      req.index = index
      res.status(200).json({ token, cart })
    }
    if (req.headers.authorization.startsWith('{')) {
      const index = carts.carts.findIndex(
        (item) => item.cartId === JSON.parse(req.headers.authorization).cartId
      )
      const tokenObject = carts.carts[index]
      const deleteNestedProduct = tokenObject.cartItem.map((item, index) => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        userId: item.userId,
        productId: item.productId
      }))
      const token = {
        cartId: tokenObject.cartId,
        cartItem: deleteNestedProduct
      }
      res.status(200).json({
        token: JSON.stringify(token),
        cart: tokenObject.cartItem
      })
    }
  } catch (err) {
    next(err)
  }
}

exports.addGuessCart = async (req, res, next) => {
  try {
    const { productId, quantity, unitPrice } = req.body

    // console.log(req.index)
    // console.log(req.carts)
    const cartItemIndex = req.carts.carts[req.index].cartItem.findIndex(
      (item, index) => item.productId === productId
    )
    if (cartItemIndex === -1) {
      const createdCartItem = await CartItem.create({
        productId,
        quantity,
        unitPrice,
        status: 'IN CART'
      })
      const cartItem = await CartItem.findOne({
        where: { id: createdCartItem.id },
        include: {
          model: Product,
          attributes: ['price', 'name', 'description', 'imgPath']
        }
      })
      // req.headers.authorization = req.carts.carts[req.index]
      const token = JSON.stringify(req.carts.carts[req.index])
      // const token = req.carts.carts[req.index]
      const cart = req.carts.carts[req.index].cartItem
      cart[cart.length] = cartItem
      await writeFile('./carts.json', JSON.stringify(req.carts))
      return res.status(200).json({ cart, token })
    }

    if (cartItemIndex !== -1) {
      const cartItem = await CartItem.findOne({
        where: {
          id: req.carts.carts[req.index].cartItem[cartItemIndex].id
        },
        include: {
          model: Product,
          attributes: ['price', 'name', 'description', 'imgPath']
        }
      })
      const token = JSON.stringify(req.carts.carts[req.index])
      req.carts.carts[req.index].cartItem[cartItemIndex] = {
        ...JSON.parse(JSON.stringify(cartItem)),
        productId,
        quantity,
        unitPrice
      }
      await writeFile('./carts.json', JSON.stringify(req.carts))
      cartItem.update({ productId, quantity, unitPrice })
      console.log(JSON.parse(JSON.stringify(cartItem)))
      const cart = req.carts.carts[req.index].cartItem
      return res.status(200).json({ cart, token })
    }
    // res.status(200).json({ cartItem })
  } catch (err) {
    next(err)
  }
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
  try {
    const { productId } = req.body
    const isAlreadyInCart = await CartItem.findOne({
      where: {
        productId,
        userId: req.user.id,
        status: 'IN CART'
      }
    })
    if (!isAlreadyInCart)
      return res
        .status(400)
        .json({ message: 'this product is not in your cart' })
    await isAlreadyInCart.update({ status: 'REMOVED' })
    res.status(204).json()
  } catch (err) {
    next(err)
  }
}
exports.removeAllUserCart = async (req, res, next) => {
  try {
    await CartItem.update(
      { status: 'REMOVED' },
      { where: { userId: req.user.id, status: 'IN CART' } }
    )
    // const isAlreadyInCart = await CartItem.findOne({
    //   where: {
    //     productId,
    //     userId: req.user.id,
    //     status: 'IN CART'
    //   }
    // })
    // if (!isAlreadyInCart)
    //   return res
    //     .status(400)
    //     .json({ message: 'this product is not in your cart' })
    // await isAlreadyInCart.update({ status: 'REMOVED' })
    res.status(204).json()
  } catch (err) {
    next(err)
  }
}
