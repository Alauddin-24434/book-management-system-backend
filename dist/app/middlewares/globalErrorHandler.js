"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = require("../error/apiError");
// ====================
// Global Error Handler Middleware
// ====================
const globalErrorHandler = (error, req, res, next) => {
    // Default error response
    let status = 500;
    let name = "InternalServerError";
    let message = "Something went wrong!";
    const errors = [];
    // --------------------
    // Handle custom application errors first
    // --------------------
    if (error instanceof apiError_1.AppError) {
        status = error.statusCode || 500;
        name = error.name || "AppError";
        message = error.message;
        errors.push({ path: "general", message });
    }
    // --------------------
    // Handle all other JS errors
    // --------------------
    else if (error instanceof Error) {
        name = error.name;
        message = error.message;
        errors.push({ path: "general", message });
    }
    const errorResponse = {
        success: false,
        name,
        message,
        error: errors, // replace previous 'issue' key with 'error'
        status,
        stack: error.stack,
    };
    return res.status(status).json(errorResponse);
};
exports.default = globalErrorHandler;
