const { Transaction, TransactionItem } = require('../models')
const sequelize = require('sequelize')

exports.purchase = async (req, res, next) => {
  const t = sequelize.transaction()
  try {
    const { items } = req.body
    const transaction = await Transaction.create(
      {
        type: 'PURCHASE',
        date: new Date(),
        status: 'WAITSUBMIT',
        userId: req.user.id
      },
      { transaction: t }
    )
    for ({ quantity, productId, price } of items) {
      const transactionItems = await TransactionItem.create(
        {
          quantity,
          productId,
          unitPrice: price,
          unitCost: price,
          transactionId: transaction.id
        },
        { transaction: t }
      )
    }
    t.commit()
    res.status(201).json({ message: 'items add to stocks' })
  } catch (err) {
    t.rollback()
    next(err)
  }
}
exports.purchaseById = async (req, res, next) => {
  const t = sequelize.transaction()
  try {
    const { productId } = req.params
    const { quantity, price } = req.body
    const transaction = await Transaction.findOne({
      where: { userId: req.user.id, status: 'WAITSUBMIT' }
    })
    // const transaction = Transaction.create(
    //   {
    //     type: 'PURCHASE',
    //     date: new Date(),
    //     status: 'WAITSUBMIT',
    //     userId: req.user.id
    //   },
    //   { transaction: t }
    // )

    const transactionItems = await TransactionItem.create(
      {
        quantity,
        productId,
        unitPrice: price,
        unitCost: price,
        transactionId: transaction.id
      },
      { transaction: t }
    )
    res.status(201).json({ message: 'items add to stocks' })
  } catch (err) {
    t.rollback()
    next(err)
  }
}
