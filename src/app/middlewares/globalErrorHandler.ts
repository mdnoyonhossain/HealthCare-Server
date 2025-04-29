import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Database validation error.";
        error = err.message
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = httpStatus.BAD_REQUEST;
            message = "Duplicate key error";
            error = err.meta;
        }
    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Unknown database error occurred.";
    }
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        message = "Database engine crashed.";
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    else if (err.name === "ValidationError") {
        message = err.message || "Validation failed.";
    }
    else if (err.message) {
        message = err.message;
    }

    res.status(statusCode).json({
        success,
        message,
        error
    });
}

export default globalErrorHandler;