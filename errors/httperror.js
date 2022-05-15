export default class HttpError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
    this.name = 'HttpError'
  }
}