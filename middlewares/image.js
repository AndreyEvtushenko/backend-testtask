import multer from 'multer'
import HttpError from '../errors/httperror.js'

const imageFilter = (req, file, callback) => {
  if(file.mimetype.startsWith('image')) {
    callback(null, true)
  } else {
    callback(new HttpError(400, 'Not an image'))
  }
}
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, process.cwd() + '/images')
  },
  filename(req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    callback(null, uniqueSuffix + file.originalname)
  }
})
const limits = {
  fileSize: 500000
}
const uploadImage = multer({storage, fileFilter: imageFilter, limits})

export default uploadImage