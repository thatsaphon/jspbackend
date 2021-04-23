const { Op } = require('sequelize')
const { Product, Category } = require('../models')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      // include: {
      //   model: 'CartItem',
      //   where: { status: 'IN CART', userId: 'user.req.id' }
      // }
    })
    console.log(products)
    res.status(200).json({ products })
  } catch (err) {
    next(err)
  }
}
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params
    const products = await Product.findAll({ where: { id } })
    res.status(200).json({ products })
  } catch (err) {
    next(err)
  }
}
exports.getFilteredProduct = async (req, res, next) => {
  try {
    let { name, description, categoryId, price } = req.query
    if (!name) name = ''
    if (!description) description = ''
    if (!categoryId) categoryId = ''
    if (!price) price = ''
    const products = await Product.findAll({
      where: {
        name: {
          [Op.substring]: `${name}`
        },
        description: {
          [Op.substring]: `${description}`
        },
        categoryId: {
          [Op.substring]: `${categoryId}`
        },
        price: {
          [Op.substring]: `${price}`
        }
      }
    })
    // console.log(products)
    res.status(200).json({ products })
  } catch (err) {
    next(err)
  }
}
exports.uploadProduct = async (req, res, next) => {
  try {
    const { code, name, description, categoryId, price } = req.body
    console.log(req.file)
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      if (err) return next(err)
      console.log(result)
      const product = await Product.create({
        code,
        name,
        description,
        categoryId,
        price,
        imgPath: result.secure_url
      })
      fs.unlinkSync(req.file.path)
      console.log(result)
      res.status(200).json({ product })
    })
  } catch (err) {
    next(err)
  }
}
exports.createProduct = async (req, res, next) => {
  try {
    console.log('test', req.body)
    if (req.user.userType !== 'ADMIN')
      return res.status(401).json({ message: 'You are unauthorized' })
    const { code, name, description, categoryId, price, imgUrl } = req.body
    const isCodeExist = await Product.findOne({ where: { code } })
    if (isCodeExist)
      return res.status(400).json({ message: 'this code is already exist' })
    const isNameExist = await Product.findOne({ where: { name } })
    if (isNameExist)
      return res
        .statue(400)
        .json({ message: 'this product name is already exist' })
    const product = await Product.create({
      code,
      name,
      description,
      categoryId,
      price,
      imgUrl
    })
    res.status(201).json({ product })
  } catch (err) {
    next(err)
  }
}
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const { code, name, description, categoryId, price } = req.body
    const isCodeExist = Product.findOne({ where: { code } })
    console.log(isCodeExist)
    if (isCodeExist)
      return res.status(400).json({ message: 'this code already exist' })
    const isNameExist = Product.findOne({ where: { name } })
    if (isNameExist)
      return res
        .statue(400)
        .json({ message: 'this product name already exist' })
    const product = await Product.update(
      { code, name, description, categoryId, price },
      { where: { id } }
    )
    res.status(200).json({ product })
  } catch (err) {
    next(err)
  }
}
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id)
    if (!product)
      return res.status(400).json({ message: 'this product ID does not exist' })
    product.destroy()
    res.status(204).json()
  } catch (err) {
    next(err)
  }
}
exports.getCategoryList = async (req, res, next) => {
  try {
    const categories = await Category.findAll()
    res.status(200).json({ categories })
  } catch (err) {
    next(err)
  }
}
exports.createCategory = async (req, res, next) => {
  try {
    if (req.user.userType !== 'ADMIN')
      return res.status(401).json({ message: 'You are unauthorized' })
    const { code, name } = req.body
    const category = await Category.create({ code, name })
    res.status(201).json({ category })
  } catch (err) {
    next(err)
  }
}
