import multer from 'multer'
import HttpError from './errors/httperror.js'
import ValidationError from './errors/validationerror.js'

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

export {httpErrorHandler, multerErrorHandler, validationErrorHandler}