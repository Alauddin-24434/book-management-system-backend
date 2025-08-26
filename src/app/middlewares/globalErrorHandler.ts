import type { Request, Response, NextFunction, ErrorRequestHandler } from "express"
import { AppError } from "../error/apiError"

// ====================
// Global Error Handler Middleware
// ====================
const globalErrorHandler: ErrorRequestHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
 
  // Default error response
  let status = 500
  let name = "InternalServerError"
  let message = "Something went wrong!"
  const errors: { path: string; message: string }[] = []

  // --------------------
  // Handle custom application errors first
  // --------------------
  if (error instanceof AppError) {
    status = error.statusCode || 500
    name = error.name || "AppError"
    message = error.message
    errors.push({ path: "general", message })
  }

  // --------------------
  // Handle all other JS errors
  // --------------------
  else if (error instanceof Error) {
    name = error.name
    message = error.message
    errors.push({ path: "general", message })
  }

  const errorResponse = {
    success: false,
    name,
    message,
    error: errors, // replace previous 'issue' key with 'error'
    status,
    stack: error.stack,
  }

  return res.status(status).json(errorResponse)
}

export default globalErrorHandler
