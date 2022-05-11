import HttpError from './httperror.js'

export default class RegistrationError extends HttpError {
  constructor(code, message, validationErrors) {
    super(code, message)
    this.name = 'RegistrationError'
    this.errors = validationErrors
  }
}