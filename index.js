import express from 'express'
import multer from 'multer'
import router from './router.js'
import HttpError from './httperror.js'
import ValidationError from './errors/validationerror.js'

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.static('images'))
app.use(express.json())
app.use(router)
app.use(validationErrorHandler)
app.use(httpErrorHandler)
app.use(multerErrorHandler)


function start() {
  try {
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}...`)
    })
  } catch(error) {
    console.log(error.message)
  }
}

function httpErrorHandler(err, req, res, next) {
  if(err instanceof HttpError) {
    console.log('HTTP Error:', err.message);
    res.status(err.code).json({message: err.message})
  } else {
    next(err)
  }
}

function multerErrorHandler(err, req, res, next) {
  if(err instanceof multer.MulterError) {
    console.log('Multer Error:', err.message)
    res.status(400).json({message: err.message})
  } else {
    next(err)
  }
}

function validationErrorHandler(err, req, res, next) {
  if(err instanceof ValidationError) {
    console.log('Validation Error:', err.message)
    res.status(err.code).json({message: err.message, errors: err.errors})
  } else {
    next(err)
  }
}

start()

export default PORT