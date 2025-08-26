export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
  }
}
