import HttpError from '../httperror.js'

export default class ValidationError extends HttpError {
  constructor(code, message, validationErrors) {
    super(code, message)
    this.name = 'ValidationError'
    this.errors = validationErrors
  }
}