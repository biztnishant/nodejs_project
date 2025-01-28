import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorhandler";

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Check if the error is an instance of AppError
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: "error",
            statusCode: err.statusCode,
            message: err.message,
            details: err.details, 
        });
    } else {
        // console.error("Unhandled Error:", err);
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "An unexpected error occurred",
        });
    }
};
