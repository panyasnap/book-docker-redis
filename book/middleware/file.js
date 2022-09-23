const multer = require('multer')
let filepath
const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, 'public/file')
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)

    }
})

module.exports = multer({storage})