const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file)
    cb(null, 'public/product/image')
  },
  filename: (req, file, cb) => {
    cb(null, 'product-' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
})
exports.upload = multer(
  { storage },
  {
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype.split('/')[1] === 'jpeg' ||
        file.mimetype.split('/')[1] === 'jpg' ||
        file.mimetype.split('/')[1] === 'png'
      )
        cb(null, true)
      else {
        cb(new Error('this file is not a photo'))
      }
    }
  }
)
