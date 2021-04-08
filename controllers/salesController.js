const { QueryTypes } = require("sequelize")
const {
  Product,
  Transaction,
  CartItem,
  sequelize,
  TransactionItem,
} = require("../models")

// exports.getAllSales = async (req, res, next) => {
//   try {
//     const sql = `SELECT t.id, t.created_at, t.updated_at, t.status, t.address,
//     IFNULL(SUM(ti.quantity*ti.unit_price),0) total FROM transactions t
//     LEFT JOIN transaction_items ti on t.id = ti.transaction_id
//     WHERE t.user_id = ${req.user.id} GROUP BY t.id ORDER BY t.id DESC`
//     const sales = await sequelize.query(sql, { type: QueryTypes.SELECT })
//     res.status(200).json({ sales })
//     // const sales = await res.status(200).json({ order: sales })
//   } catch (err) {
//     next(err)
//   }
// }
exports.getAllSales = async (req, res, next) => {
  try {
    const sales = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "desc"]],
      include: {
        model: TransactionItem,
        attributes: ["productId", "quantity", "unitPrice"],
      },
      attributes: ["id", "createdAt", "updatedAt", "status", "address"],
    })
    // const sales = await Transaction.query(
    //   `SELECT transaction.id, date, status, address, first_name, sur_name, phone, email,
    //   created_at, updated_at, user_id, SUM(quantity*unit_price)
    //   FROM TRANSACTIONS LEFT JOIN TRANSACTION_ITEMS ON transactions.id = transaction_items.transaction_id
    //   group by transaction.id`
    // )
    res.status(200).json({ order: sales })
  } catch (err) {
    next(err)
  }
}
exports.getsalesById = async (req, res, next) => {
  try {
    const { id } = req.params
    const sale = await Transaction.findOne({
      where: { id },
      include: {
        model: TransactionItem,
        attributes: ["productId", "quantity", "unitPrice"],
      },
      attributes: [
        "id",
        "createdAt",
        "updatedAt",
        "status",
        "address",
        "userId",
      ],
    })
    console.log(sale)
    if (sale.userId !== req.user.id)
      return res
        .status(400)
        .json({ message: "You are unauthorized to see this order" })
    res.status(200).json({ sale })
  } catch (err) {
    next(err)
  }
}
exports.createSales = async (req, res, next) => {
  try {
    const { address, firstName, surName, phone, email } = req.body
    const cartItems = await CartItem.findAll({
      where: {
        userId: req.user.id,
        status: "IN CART",
      },
    })
    if (!cartItems.length)
      return res.status(400).json({ message: "You have no item in cart" })

    // const t = await sequelize.transaction()
    const result = await sequelize.transaction(async (t) => {
      const transaction = await Transaction.create(
        {
          address,
          firstName,
          surName,
          phone,
          email,
          type: "SALES",
          date: new Date(),
          status: "ORDERS",
          userId: req.user.id,
        },
        { transaction: t }
      )
      console.log("ssssssssssssssssssssssssss", transaction.id)
      // const products = await Product.findAll()
      const transactionItems = []
      for (cartItem of cartItems) {
        const product = await Product.findOne({
          where: { id: cartItem.productId },
        })
        const item = await TransactionItem.create(
          {
            productId: cartItem.productId,
            transactionId: transaction.id,
            quantity: cartItem.quantity,
            unitPrice: cartItem.unitPrice,
            unitCost: product.averageCost,
          },
          { transaction: t }
        )
        transactionItems.push(item)
        cartItem.status = "SUBMIT TO ORDER"
      }
      await CartItem.update(
        { status: "SUBMIT TO ORDER" },
        {
          where: { userId: req.user.id, status: "IN CART" },
          transaction: t,
        }
      )
    })

    console.log(result)
    res.status(200).json({ message: "test" })
  } catch (err) {
    next(err)
  }
}
exports.changeSalesStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const { id } = req.params
    const sale = await Transaction.findOne({ where: { id } })
    if (sale.userId !== req.user.id)
      return res
        .status(400)
        .json({ message: "You are unauthorized on this order" })
    sale.update({ status })
    res.status(200).json({ message: `Order's status is updated to ${status}` })
  } catch (err) {
    next(err)
  }
}